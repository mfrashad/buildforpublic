"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { buildVenueApiDocs, buildNonprofitApiDocs } from "@/lib/venueApiDocs";
import { ConfirmModal, SectionHeader } from "../ui";

function baseSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  if (explicit) return explicit;
  const cloud = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";
  return cloud.replace(".convex.cloud", ".convex.site");
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-xs px-3 py-1.5 bg-black text-white rounded-lg font-medium disabled:opacity-50"
      disabled={!text}
    >
      {copied ? "Copied!" : label}
    </button>
  );
}

export default function ApiAccessTab() {
  const myKey = useQuery(api.apiKeys.getMyApiKey);
  const generate = useMutation(api.apiKeys.generateMyApiKey);
  const revoke = useMutation(api.apiKeys.revokeMyApiKey);

  const [revealed, setRevealed] = useState(false);
  const [confirmRotate, setConfirmRotate] = useState(false);
  const [busy, setBusy] = useState(false);
  const [docKind, setDocKind] = useState<"venues" | "nonprofits">("venues");

  const base = baseSiteUrl();
  const keyValue = myKey?.key ?? "";
  const docs = useMemo(
    () =>
      docKind === "venues"
        ? buildVenueApiDocs(base, keyValue)
        : buildNonprofitApiDocs(base, keyValue),
    [docKind, base, keyValue],
  );

  const masked = keyValue
    ? `${keyValue.slice(0, 8)}${"•".repeat(Math.max(0, keyValue.length - 12))}${keyValue.slice(-4)}`
    : "";

  async function doGenerate() {
    setBusy(true);
    await generate({});
    setBusy(false);
    setRevealed(true);
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <ConfirmModal
        open={confirmRotate}
        title="Generate a new key?"
        description="Your current key will stop working immediately. Any agent or script using it must be updated with the new key."
        confirmLabel="Generate new key"
        danger
        onConfirm={async () => {
          setConfirmRotate(false);
          await doGenerate();
        }}
        onCancel={() => setConfirmRotate(false)}
      />

      {/* ── Your API key ── */}
      <div>
        <SectionHeader title="Your API key" />
        <p className="text-sm text-black/50 mb-4 leading-relaxed">
          A personal key for the venue outreach API. It&apos;s tied to your account —
          generate one, then paste the docs below into your AI agent to let it fill
          the venue list. Keep it private; treat it like a password.
        </p>

        {myKey === undefined ? (
          <div className="h-12 bg-black/5 rounded-xl animate-pulse" />
        ) : myKey === null ? (
          <button
            onClick={doGenerate}
            disabled={busy}
            className="text-sm px-5 py-2.5 bg-black text-white rounded-lg font-medium disabled:opacity-50"
          >
            {busy ? "Generating…" : "Generate API key"}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <code className="text-sm font-mono px-3 py-2 border border-black/15 rounded-lg bg-black/[0.03] text-black/80 break-all">
                {revealed ? keyValue : masked}
              </code>
              <button
                onClick={() => setRevealed((v) => !v)}
                className="text-xs px-3 py-1.5 border border-black/15 rounded-lg text-black/50 hover:text-black hover:border-black/40 transition-colors"
              >
                {revealed ? "Hide" : "Reveal"}
              </button>
              <CopyButton text={keyValue} label="Copy key" />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setConfirmRotate(true)}
                className="text-xs text-black/40 hover:text-black underline underline-offset-2"
              >
                Regenerate
              </button>
              <button
                onClick={async () => {
                  setBusy(true);
                  await revoke({});
                  setBusy(false);
                }}
                className="text-xs text-red-500/70 hover:text-red-600 underline underline-offset-2"
              >
                Revoke
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Base URL ── */}
      <div>
        <SectionHeader title="Base URL" />
        <div className="flex items-center gap-2">
          <code className="text-sm font-mono px-3 py-2 border border-black/15 rounded-lg bg-black/[0.03] text-black/80 break-all flex-1">
            {base}
          </code>
          <CopyButton text={base} />
        </div>
      </div>

      {/* ── Agent docs ── */}
      <div>
        <SectionHeader title="Agent instructions (copy → paste into your AI chat)">
          <CopyButton text={docs} label="Copy docs" />
        </SectionHeader>
        <div className="flex gap-1 border border-black/10 rounded-lg p-1 w-fit mb-3">
          {(["venues", "nonprofits"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setDocKind(k)}
              className={`text-xs px-4 py-1.5 rounded-md font-medium transition-colors ${
                docKind === k ? "bg-black text-white" : "text-black/50 hover:text-black"
              }`}
            >
              {k === "venues" ? "Venues" : "NGO outreach"}
            </button>
          ))}
        </div>
        {!keyValue && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
            Generate your API key above first — it gets embedded in the docs so the
            agent can authenticate.
          </p>
        )}
        <pre className="text-xs font-mono whitespace-pre-wrap border border-black/15 rounded-xl p-4 bg-black/[0.02] text-black/75 leading-relaxed max-h-[28rem] overflow-y-auto">
          {docs}
        </pre>
      </div>
    </div>
  );
}
