"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
import { AI_COMMUNITIES } from "@/lib/constants";

const CARD_WIDTH = 260;
const GAP = 16;
const SCROLL_SPEED = 0.5; // px per frame

export default function CommunitySection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const xRef = useRef(0);
  const controls = useAnimationControls();

  const totalWidth = AI_COMMUNITIES.length * (CARD_WIDTH + GAP) - GAP;

  const animate = useCallback(() => {
    if (isHovered || isDragging) return;

    const containerWidth = carouselRef.current?.offsetWidth ?? 0;
    const maxScroll = totalWidth - containerWidth;

    xRef.current -= SCROLL_SPEED;
    if (Math.abs(xRef.current) >= maxScroll) {
      xRef.current = 0;
    }

    controls.set({ x: xRef.current });
  }, [isHovered, isDragging, totalWidth, controls]);

  useEffect(() => {
    let rafId: number;

    const tick = () => {
      animate();
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [animate]);

  return (
    <section id="community" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <div className="md:flex md:items-center md:gap-16 mb-16">
          {/* Text content */}
          <div className="md:w-1/2 mb-10 md:mb-0">
            <span className="text-xs font-medium text-text-secondary bg-surface-raised px-3 py-1 rounded-full inline-block mb-6">
              COMING SOON
            </span>

            <h2 className="heading-section text-text-primary mb-6">
              Community
            </h2>

            <p className="text-lg text-text-secondary leading-relaxed mb-6">
              Biweekly sessions connecting builders to NGOs and social impact
              orgs. Part workshop, part co-working, part open hangout. We form
              teams, match real needs to builders, and ship projects that matter.
            </p>

            <a
              href="/volunteer"
              className="text-base font-medium text-clay hover:text-clay-hover transition-colors"
            >
              Join as Volunteer Committee &rarr;
            </a>
          </div>

          {/* Visual block */}
          <div className="md:w-1/2">
            <div className="card-flat overflow-hidden min-h-[280px]">
              <Image
                src="/sprites/initiative-community.png"
                alt="Community of builders collaborating"
                width={800}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* AI Communities Carousel */}
        <div>
          <h3
            className="text-xl text-text-primary mb-6"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 600 }}
          >
            Explore Other AI Communities
          </h3>
          <div
            ref={carouselRef}
            className="overflow-hidden cursor-grab"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              drag="x"
              dragConstraints={carouselRef}
              animate={controls}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(_, info) => {
                setIsDragging(false);
                xRef.current = info.point.x !== undefined ? xRef.current + info.offset.x : xRef.current;
              }}
              className="flex gap-4"
              style={{ width: "max-content" }}
            >
              {AI_COMMUNITIES.map((community) => (
                <a
                  key={community.name}
                  href={community.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-flat p-5 flex-shrink-0 hover:border-clay/30 transition-colors"
                  style={{ width: CARD_WIDTH }}
                  draggable={false}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {community.image ? (
                      <Image
                        src={community.image}
                        alt={community.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-olive/20 flex items-center justify-center text-olive font-semibold text-sm flex-shrink-0">
                        {community.name.charAt(0)}
                      </div>
                    )}
                    <h4
                      className="text-sm text-text-primary font-medium leading-tight"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {community.name}
                    </h4>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                    {community.description}
                  </p>
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
