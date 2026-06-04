"use client";

// BrickPhysics — headless matter.js engine driving DOM-sprite isometric bricks.
// Physics bodies are invisible rectangles; brick images are synced to their
// positions each frame via a manual RAF + Engine.update loop. No canvas rendered.
//
// Modes:
//   gravity=0  → floating bricks that drift and bounce off walls (Hero)
//   gravity≈1  → falling bricks that pile on the floor and respawn (Invitation)
//
// Interactivity:
//   drag=true  → Matter.MouseConstraint lets users grab and fling bricks.
//                Automatically disabled on coarse-pointer (touch) devices.
//
// Performance:
//   IntersectionObserver pauses Engine.update (no physics ticks) while the
//   container is off-screen, keeping idle CPU at ~0.
//
// Accessibility:
//   useReducedMotion → physics never starts; static bricks shown at low opacity.

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { BRICK_RATIO, BrickColor, BrickType } from "./BrickSprite";

export type BrickDef = {
  type: BrickType;
  color: BrickColor;
  /** Rendered sprite width in px (height derived from 128:144 ratio). Default 80. */
  size?: number;
  /** Initial X position as % of container width (0–100). */
  xPct?: number;
  /** Initial Y position as % of container height (0–100). Floating mode only. */
  yPct?: number;
  /** Fixed visual rotation in degrees. Default 0. */
  visualTilt?: number;
};

// Physics body height as a fraction of sprite height (the isometric footprint).
const BODY_H_RATIO = 0.32;

interface BrickPhysicsProps {
  bricks: BrickDef[];
  /** 0 = float/ambient, ~0.8 = gentle fall. Default 0. */
  gravity?: number;
  /** Enable mouse/pointer drag. Touch devices are always excluded. */
  drag?: boolean;
  /** Respawn bricks that exit the bottom back at the top. Default false. */
  respawn?: boolean;
  className?: string;
}

export default function BrickPhysics({
  bricks,
  gravity = 0,
  drag = false,
  respawn = false,
  className = "",
}: BrickPhysicsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spriteRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const reduced      = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reduced) return;

    let rafId: number;
    let cleanup: (() => void) | undefined;

    // Dynamic import keeps matter-js out of the SSR bundle
    import("matter-js").then((Matter) => {
      const { Engine, Bodies, Body, World } = Matter;

      const { width: W, height: H } = container.getBoundingClientRect();
      if (W === 0 || H === 0) return;

      // ── Engine ────────────────────────────────────────────────────────────────
      const engine = Engine.create({ gravity: { x: 0, y: gravity } });

      // ── Walls (static) ────────────────────────────────────────────────────────
      const wallOpts = { isStatic: true, friction: 0.3, restitution: 0.25, label: "wall" };
      const floor = Bodies.rectangle(W / 2, H + 30, W + 120, 60, wallOpts);
      const left  = Bodies.rectangle(-30, H / 2, 60, H * 4, wallOpts);
      const right = Bodies.rectangle(W + 30, H / 2, 60, H * 4, wallOpts);
      const staticBodies = [floor, left, right];
      if (gravity === 0) {
        staticBodies.push(Bodies.rectangle(W / 2, -30, W + 120, 60, wallOpts));
      }
      World.add(engine.world, staticBodies);

      // ── Brick bodies ──────────────────────────────────────────────────────────
      // For falling mode: evenly spaced X slots, shuffled so fall order is random
      const xSlots: number[] = (() => {
        if (gravity === 0) return [];
        const slots = bricks.map((_, i) =>
          W * (0.05 + 0.9 * (i / Math.max(bricks.length - 1, 1)))
        );
        for (let i = slots.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [slots[i], slots[j]] = [slots[j], slots[i]];
        }
        return slots;
      })();

      const bodies = bricks.map((b, i) => {
        const sw = b.size ?? 80;
        const sh = sw * BRICK_RATIO;
        const bh = sh * BODY_H_RATIO;

        const initX =
          b.xPct !== undefined
            ? (b.xPct / 100) * W
            : gravity > 0
              ? xSlots[i]
              : W * 0.1 + W * 0.8 * (i / Math.max(bricks.length - 1, 1));

        const initY =
          gravity > 0
            ? -(sh + i * 90 + Math.random() * 80)
            : b.yPct !== undefined
              ? (b.yPct / 100) * H
              : H * 0.15 + H * 0.7 * (i / Math.max(bricks.length - 1, 1));

        const body = Bodies.rectangle(initX, initY, sw, bh, {
          restitution: gravity === 0 ? 0.6 : 0.35,
          friction: 0.5,
          frictionAir: gravity === 0 ? 0.006 : 0.01,
          inertia: Infinity, // lock rotation — iso sprites look wrong when spinning
          label: `brick-${i}`,
        });

        if (gravity === 0) {
          Body.setVelocity(body, {
            x: (Math.random() - 0.5) * 2.5,
            y: (Math.random() - 0.5) * 2.5,
          });
        }
        return body;
      });

      World.add(engine.world, bodies);

      // ── Pointer-based drag ────────────────────────────────────────────────────
      // We use the Pointer Events API + setPointerCapture instead of
      // Matter.MouseConstraint. This solves two issues with the old approach:
      //   1. Text/content elements at higher z-index intercepted pointer events,
      //      making bricks under text impossible to grab.
      //   2. Mid-drag jank when the cursor moved over other elements.
      //
      // setPointerCapture redirects ALL subsequent pointer events (move, up,
      // cancel) to the brick that was grabbed, regardless of what's rendered on
      // top. The container z-index is temporarily elevated while dragging so the
      // grabbed brick renders above content visually.
      if (drag) {
        // Per-brick drag state (avoids closure issues with stale indices)
        const dragState: {
          pointerId: number | null;
          bodyIndex: number;
          offsetX: number;
          offsetY: number;
          prevX: number;
          prevY: number;
          velX: number;
          velY: number;
        } = {
          pointerId: null,
          bodyIndex: -1,
          offsetX: 0,
          offsetY: 0,
          prevX: 0,
          prevY: 0,
          velX: 0,
          velY: 0,
        };

        const getContainerPos = (clientX: number, clientY: number) => {
          const r = container.getBoundingClientRect();
          return { x: clientX - r.left, y: clientY - r.top };
        };

        bodies.forEach((body, i) => {
          const el = spriteRefs.current[i];
          if (!el) return;

          el.addEventListener("pointerdown", (e: PointerEvent) => {
            if (dragState.pointerId !== null) return; // another brick already grabbed
            e.preventDefault();
            el.setPointerCapture(e.pointerId);

            const pos = getContainerPos(e.clientX, e.clientY);
            dragState.pointerId = e.pointerId;
            dragState.bodyIndex = i;
            // Offset = distance from cursor to body centre, so the brick doesn't jump
            dragState.offsetX = body.position.x - pos.x;
            dragState.offsetY = body.position.y - pos.y;
            dragState.prevX = pos.x;
            dragState.prevY = pos.y;
            dragState.velX = 0;
            dragState.velY = 0;

            Body.setStatic(body, true); // freeze physics while held
            // Raise brick layer above hero content so dragging over text is smooth
            container.style.zIndex = "20";
            el.style.cursor = "grabbing";
          });

          el.addEventListener("pointermove", (e: PointerEvent) => {
            if (dragState.bodyIndex !== i || dragState.pointerId !== e.pointerId) return;
            const pos = getContainerPos(e.clientX, e.clientY);

            // Exponential moving average velocity for fling-on-release
            dragState.velX = 0.4 * (pos.x - dragState.prevX) + 0.6 * dragState.velX;
            dragState.velY = 0.4 * (pos.y - dragState.prevY) + 0.6 * dragState.velY;
            dragState.prevX = pos.x;
            dragState.prevY = pos.y;

            Body.setPosition(body, {
              x: pos.x + dragState.offsetX,
              y: pos.y + dragState.offsetY,
            });
          });

          const release = (e: PointerEvent) => {
            if (dragState.bodyIndex !== i || dragState.pointerId !== e.pointerId) return;
            dragState.pointerId = null;
            dragState.bodyIndex = -1;

            Body.setStatic(body, false);
            // Apply fling velocity (clamped to prevent escape)
            Body.setVelocity(body, {
              x: Math.max(-20, Math.min(20, dragState.velX * 1.5)),
              y: Math.max(-20, Math.min(20, dragState.velY * 1.5)),
            });

            container.style.zIndex = ""; // restore to className value (z-0)
            el.style.cursor = "grab";
          };

          el.addEventListener("pointerup", release);
          el.addEventListener("pointercancel", release);
        });
      }

      // ── Manual RAF + Engine.update loop ──────────────────────────────────────
      // Using Engine.update directly avoids all Matter.Runner start/stop issues.
      // The IntersectionObserver simply toggles a flag to skip ticks off-screen.
      let lastTime: number | null = null;
      let active = true; // controlled by IntersectionObserver
      let frame = 0;

      const tick = (time: number) => {
        rafId = requestAnimationFrame(tick);

        if (active) {
          // Step the physics engine
          const delta = lastTime !== null ? Math.min(time - lastTime, 33) : 16.67;
          Engine.update(engine, delta);
        }
        lastTime = time;
        frame++;

        // Sync body positions → DOM sprites (always, so bricks don't freeze on re-entry)
        bodies.forEach((body, i) => {
          const el = spriteRefs.current[i];
          if (!el) return;

          const b  = bricks[i];
          const sw = b.size ?? 80;
          const sh = sw * BRICK_RATIO;
          const bh = sh * BODY_H_RATIO;

          const left = body.position.x - sw / 2;
          const top  = body.position.y + bh / 2 - sh;
          const tilt = b.visualTilt ?? 0;

          el.style.transform = `translate(${left}px, ${top}px) rotate(${tilt}deg)`;
          if (el.style.opacity === "0") el.style.opacity = "1";

          // Respawn bricks that fall off the bottom
          if (respawn && body.position.y > H + sh + 60) {
            Body.setPosition(body, {
              x: W * (0.05 + Math.random() * 0.9),
              y: -(sh + Math.random() * 200),
            });
            Body.setVelocity(body, { x: (Math.random() - 0.5) * 0.8, y: 0.5 });
          }

          // Floating mode: nudge bricks that have stalled
          if (gravity === 0 && frame % 100 === (i * 23) % 100) {
            const vx = body.velocity.x, vy = body.velocity.y;
            if (Math.sqrt(vx * vx + vy * vy) < 0.4) {
              Body.applyForce(body, body.position, {
                x: (Math.random() - 0.5) * 0.0018,
                y: (Math.random() - 0.5) * 0.0018,
              });
            }
          }
        });
      };

      rafId = requestAnimationFrame(tick);

      // ── IntersectionObserver: pause Engine.update when off-screen ─────────────
      const observer = new IntersectionObserver(
        ([entry]) => { active = entry.isIntersecting; },
        { rootMargin: "200px" }
      );
      observer.observe(container);

      cleanup = () => {
        cancelAnimationFrame(rafId);
        World.clear(engine.world, false);
        Engine.clear(engine);
        observer.disconnect();
      };
    });

    return () => cleanup?.();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Reduced-motion fallback: static scattered bricks ─────────────────────────
  if (reduced) {
    return (
      <div className={`${className} pointer-events-none`} aria-hidden="true">
        {bricks.map((b, i) => {
          const sw   = b.size ?? 80;
          const sh   = sw * BRICK_RATIO;
          const xPct = b.xPct ?? 10 + 80 * (i / Math.max(bricks.length - 1, 1));
          const yPct = b.yPct ?? (gravity > 0 ? 75 : 25 + 50 * (i % 3) / 2);
          return (
            <div
              key={i}
              className="absolute select-none"
              style={{
                left:      `${xPct}%`,
                top:       `${yPct}%`,
                width:     sw,
                height:    sh,
                opacity:   0.25,
                transform: `translate(-50%, -50%) rotate(${b.visualTilt ?? 0}deg)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/bricks/${b.color}-${b.type}.png`} width={sw} height={sh} alt="" draggable={false} />
            </div>
          );
        })}
      </div>
    );
  }

  // ── Normal render: opacity-0 divs whose transforms are driven by the tick loop
  // The container itself is pointer-events-none so empty space passes through to
  // links and buttons in the content layer. Only brick sprite divs have
  // pointer-events-auto (when drag=true), so they alone capture pointer events.
  return (
    <div
      ref={containerRef}
      className={`${className} pointer-events-none`}
      aria-hidden="true"
    >
      {bricks.map((b, i) => {
        const sw = b.size ?? 80;
        const sh = sw * BRICK_RATIO;
        return (
          <div
            key={i}
            ref={(el) => { spriteRefs.current[i] = el; }}
            className="absolute select-none"
            style={{
              width:         sw,
              height:        sh,
              top:           0,
              left:          0,
              opacity:       0,
              willChange:    "transform",
              cursor:        drag ? "grab" : "default",
              pointerEvents: drag ? "auto" : "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/bricks/${b.color}-${b.type}.png`}
              width={sw}
              height={sh}
              alt=""
              draggable={false}
              style={{ display: "block", userSelect: "none" }}
            />
          </div>
        );
      })}
    </div>
  );
}
