"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const ACCENT_COLORS = ["#fff200", "#94e8ff", "#6ff5b6", "#ffc0a1", "#e8d5ff"];

function getAccent(id: string) {
  return ACCENT_COLORS[id.charCodeAt(id.length - 1) % ACCENT_COLORS.length];
}

export default function MemberAvatarStack({ center = false }: { center?: boolean }) {
  const data = useQuery(api.members.listPreview);

  if (!data || data.total === 0) return null;

  const { total, preview } = data;
  const shown = preview.slice(0, 5);
  const overflow = total - shown.length;

  // Build a readable names string: "Ana, Marco and 47 others"
  const nameList = preview.slice(0, 3).map((m) => m.firstName);
  const rest = total - nameList.length;
  const namesText =
    nameList.length === 1
      ? `${nameList[0]} and ${rest} others`
      : `${nameList.slice(0, -1).join(", ")}, ${nameList[nameList.length - 1]} and ${rest} others`;

  return (
    <div className={`flex flex-col gap-2 ${center ? "items-center" : "items-start"}`}>
      {/* Stacked avatars */}
      <div className="flex items-center">
        {shown.map((m, i) => (
          <div
            key={m._id}
            className="relative rounded-full border-[2.5px] border-white"
            style={{ marginLeft: i === 0 ? 0 : -10, zIndex: shown.length - i }}
          >
            {m.imageUrl ? (
              <img
                src={m.imageUrl}
                alt={m.firstName}
                className="w-7 h-7 rounded-full object-cover block"
              />
            ) : (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black"
                style={{ background: getAccent(m._id) }}
              >
                {m.firstName[0].toUpperCase()}
              </div>
            )}
          </div>
        ))}

        {overflow > 0 && (
          <div
            className="w-7 h-7 rounded-full border-[2.5px] border-white flex items-center justify-center text-xs font-bold text-black"
            style={{ marginLeft: -10, zIndex: 0, background: "#fff200" }}
          >
            +{overflow}
          </div>
        )}
      </div>

      {/* Names line */}
      <p className="text-[11px] text-black/40 leading-relaxed">
        <span className="text-black/60 font-medium">{namesText}</span>
        {" "}already inside
      </p>
    </div>
  );
}
