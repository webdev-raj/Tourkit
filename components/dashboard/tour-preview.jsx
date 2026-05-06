"use client"

import { useMemo } from "react"

import { Button } from "@/components/ui/button"

const ACCENT = "#F15025"

function PositionButton({ value, selected, onSelect, children }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={`h-9 flex-1 rounded-xl border-white/10 bg-background/20 text-xs ${
        selected ? "border-[#F15025]/60 bg-[#F15025]/10 text-[#F15025]" : "hover:bg-muted/20"
      }`}
      onClick={() => onSelect?.(value)}>
      {children}
    </Button>
  )
}

export function TourPreview({
  title,
  message,
  position,
  stepNumber,
  totalSteps,
  onPositionChange,
  customization,
}) {
  const primaryColor = customization?.primary_color || "#F15025"
  const fontFamily = customization?.font_family || "Inter"
  const borderRadius = customization?.border_radius || "10px"
  const theme = customization?.theme || "dark"

  const dark = theme !== "light"
  const bg = dark ? "#111111" : "#ffffff"
  const border = dark ? "#2a2a2a" : "#e5e7eb"
  const text = dark ? "#ffffff" : "#111111"
  const subtext = dark ? "#999999" : "#6b7280"
  const buttonGhost = dark ? "#1e1e1e" : "#f9fafb"
  const buttonGhostBorder = dark ? "#333333" : "#e5e7eb"
  const buttonGhostText = dark ? "#cccccc" : "#374151"

  const safeTitle = String(title || "").trim() || `Step ${stepNumber || 1}`
  const safeMessage = String(message || "").trim() || "Your tooltip message will appear here."
  const pos = String(position || "bottom").toLowerCase()

  const nextLabel = useMemo(() => {
    if (!totalSteps || !stepNumber) return "Next"
    return stepNumber >= totalSteps ? "Finish" : "Next"
  }, [stepNumber, totalSteps])

  const tooltip = (
    <div
      className="w-full max-w-[320px] rounded-[10px] border px-6 py-5 text-[14px] leading-[1.6] shadow-[0_20px_60px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)]"
      style={{
        fontFamily: `${fontFamily}, system-ui, -apple-system, sans-serif`,
        borderRadius,
        borderColor: border,
        backgroundColor: bg,
        color: text,
      }}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div
          className="rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
          style={{
            color: primaryColor,
            backgroundColor: `${primaryColor}26`,
          }}>
          Step {Math.max(stepNumber || 1, 1)} of {Math.max(totalSteps || 1, 1)}
        </div>
        <button
          type="button"
          className="inline-flex size-6 items-center justify-center rounded text-sm"
          style={{ color: subtext }}
          aria-label="Close preview">
          ×
        </button>
      </div>
      <div className="mb-4 h-[3px] overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{
            width: `${(Math.max(stepNumber || 1, 1) / Math.max(totalSteps || 1, 1)) * 100}%`,
            backgroundColor: primaryColor,
          }}
        />
      </div>
      <div className="mb-1 text-[15px] font-semibold" style={{ color: text }}>
        {safeTitle}
      </div>
      <div className="mb-4 text-[13px]" style={{ color: subtext }}>
        {safeMessage}
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          className="rounded-[6px] border px-4 py-2 text-[13px] font-medium"
          style={{
            borderColor: buttonGhostBorder,
            backgroundColor: buttonGhost,
            color: buttonGhostText,
          }}>
          ← Prev
        </button>
          <button
            type="button"
            className="rounded-[6px] border border-transparent px-4 py-2 text-[13px] font-medium text-white"
            style={{ backgroundColor: primaryColor }}>
            {nextLabel === "Finish" ? "Finish" : "Next →"}
          </button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground">Preview</div>
          <div className="mt-1 text-xs text-muted-foreground">Updates as you type</div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/20 px-2.5 py-1 text-[0.7rem] font-medium text-foreground">
          <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
          Live
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-xs font-medium text-muted-foreground">Element highlight</div>
        <div
          className="rounded-lg border border-dashed px-4 py-4 text-sm text-muted-foreground"
          style={{ borderColor: ACCENT }}>
          ← Your selected element appears here
        </div>
      </div>

      <div className="relative flex min-h-[220px] items-center justify-center rounded-xl border border-white/10 bg-background/10 p-5">
        {pos === "top" ? (
          <div className="absolute inset-x-4 top-4 flex justify-center">{tooltip}</div>
        ) : null}
        {pos === "left" ? (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">{tooltip}</div>
        ) : null}
        {pos === "right" ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">{tooltip}</div>
        ) : null}
        {pos === "bottom" ? (
          <div className="absolute inset-x-4 bottom-4 flex justify-center">{tooltip}</div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-xs font-medium text-muted-foreground">Position</div>
        <div className="grid grid-cols-2 gap-2">
          <PositionButton value="top" selected={pos === "top"} onSelect={onPositionChange}>
            Top
          </PositionButton>
          <PositionButton value="bottom" selected={pos === "bottom"} onSelect={onPositionChange}>
            Bottom
          </PositionButton>
          <PositionButton value="left" selected={pos === "left"} onSelect={onPositionChange}>
            Left
          </PositionButton>
          <PositionButton value="right" selected={pos === "right"} onSelect={onPositionChange}>
            Right
          </PositionButton>
        </div>
      </div>
    </div>
  )
}

