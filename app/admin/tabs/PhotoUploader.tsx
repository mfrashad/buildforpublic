"use client";

import { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type Area = { x: number; y: number; width: number; height: number };

// Crop the selected area of an image to a square and return a JPEG blob.
async function getCroppedBlob(src: string, area: Area, size = 512): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = src;
  });
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    img,
    area.x, area.y, area.width, area.height,
    0, 0, size, size,
  );
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("crop failed"))), "image/jpeg", 0.9),
  );
}

export default function PhotoUploader({
  committeeId,
  currentUrl,
  hasUpload,
}: {
  committeeId: Id<"committee">;
  currentUrl: string | null;
  hasUpload: boolean;
}) {
  const generateUploadUrl = useMutation(api.committee.generateUploadUrl);
  const setImage = useMutation(api.committee.setImage);

  const fileRef = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => setPixels(areaPixels), []);

  function loadFile(file: File | undefined | null) {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image is too large (max 10MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  }

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    loadFile(e.target.files?.[0]);
    e.target.value = ""; // allow re-selecting the same file
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  }

  async function save() {
    if (!src || !pixels) return;
    setBusy(true);
    try {
      const blob = await getCroppedBlob(src, pixels);
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": blob.type },
        body: blob,
      });
      const { storageId } = await res.json();
      await setImage({ id: committeeId, imageStorageId: storageId as Id<"_storage"> });
      setSrc(null);
    } finally {
      setBusy(false);
    }
  }

  async function removeUpload() {
    setBusy(true);
    try {
      await setImage({ id: committeeId, clear: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        {/* current preview */}
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentUrl} alt="" className="w-16 h-16 rounded-full object-cover border border-black/20 shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-full border border-dashed border-black/25 flex items-center justify-center text-black/30 text-xs shrink-0">
            none
          </div>
        )}

        {/* drop zone */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex-1 cursor-pointer rounded-xl border-2 border-dashed px-4 py-4 text-center transition-colors ${
            dragging ? "border-black bg-black/[0.04]" : "border-black/25 hover:border-black/50 bg-black/[0.015]"
          }`}
        >
          <p className="text-sm text-black/70 font-medium">
            <span className="underline underline-offset-2">Click to upload</span> or drag &amp; drop
          </p>
          <p className="text-[11px] text-black/35 mt-0.5">PNG / JPG · up to 10MB · you&apos;ll crop it next</p>
        </div>

        {hasUpload && (
          <button
            type="button"
            onClick={removeUpload}
            disabled={busy}
            className="text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50 shrink-0 self-start"
          >
            Remove
          </button>
        )}
      </div>
      <p className="text-[11px] text-black/35 mt-1.5">
        {hasUpload ? "Using uploaded photo." : "No upload — falls back to their Google/Clerk photo."}
      </p>
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
      <input ref={fileRef} type="file" accept="image/*" onChange={pickFile} className="hidden" />

      {/* crop modal */}
      {src && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-black rounded-2xl p-5 w-full max-w-md shadow-[4px_4px_0_#000]">
            <p className="font-semibold text-black mb-3">Crop photo</p>
            <div className="relative w-full h-72 bg-black/80 rounded-xl overflow-hidden">
              <Cropper
                image={src}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs text-black/40">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setSrc(null)}
                disabled={busy}
                className="text-sm px-4 py-2 border border-black/20 rounded-lg text-black/60 hover:border-black/50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={busy || !pixels}
                className="text-sm px-4 py-2 bg-black text-white rounded-lg font-medium disabled:opacity-50"
              >
                {busy ? "Saving…" : "Save photo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
