"use client"

import { AWButton } from "@/components/AWButton"
import Image from "next/image"
import equalizerIcon from "@/assets/svg/equalizer.svg"
import endCallIcon from "@/assets/svg/end-call.svg"

type VoiceOrbProps = {
  isConnected: boolean
  isConnecting: boolean
  isSpeaking: boolean
  speakingLevel: number
  onStartTalk: () => void
  onEndTalk: () => void
}

export function VoiceOrb({
  isConnected,
  isConnecting,
  isSpeaking,
  speakingLevel,
  onStartTalk,
  onEndTalk,
}: VoiceOrbProps) {
  // Derived values
  const normalizedLevel = Math.max(0, Math.min(1, speakingLevel));
  const expressiveLevel = isSpeaking ? Math.max(0.2, normalizedLevel) : normalizedLevel;

  const scale = isConnected ? 1 + expressiveLevel * 0.18 : 1;

  const orbBackground = isSpeaking
    ? "radial-gradient(circle at 30% 30%, #dbeafe 0%, #60a5fa 28%, #1d4ed8 62%, #020617 100%)"
    : "radial-gradient(circle at 30% 30%, #a5f3fc 0%, #3b82f6 35%, #111827 100%)";

  const orbGlow = isConnected
    ? `0 0 0 14px rgba(59, 130, 246, ${0.24 + expressiveLevel * 0.28}), 0 0 ${110 + expressiveLevel * 140}px rgba(37, 99, 235, ${0.42 + expressiveLevel * 0.33})`
    : "0 0 0 10px rgba(148, 163, 184, 0.16), 0 0 60px rgba(15, 23, 42, 0.35)";

    
  return (
    <div className="grid place-items-center gap-2.5">
      <div
        className={`relative grid h-[240px] w-[240px] place-items-center rounded-full sm:h-[300px] sm:w-[300px] ${isConnected ? (isSpeaking ? "animate-orb-fast" : "animate-orb-slow") : ""}`}
        style={{
          background: orbBackground,
          boxShadow: orbGlow,
          transform: `scale(${scale})`,
          transition: "transform 120ms linear, box-shadow 120ms linear",
        }}
      >
        {isConnected ? (
          <>
            <div
              className="pointer-events-none absolute -inset-[10px] rounded-full border border-cyan-300/40 animate-orb-ring"
              style={{ animationDuration: `${1.7 - expressiveLevel * 0.8}s` }}
            />
            <div
              className="pointer-events-none absolute -inset-6 rounded-full border border-cyan-300/35 animate-orb-ring-delay"
              style={{ animationDuration: `${2.2 - expressiveLevel * 0.9}s` }}
            />
            <div
              className="pointer-events-none absolute -inset-10 rounded-full border border-blue-300/30 animate-orb-ring"
              style={{
                animationDuration: `${2.7 - expressiveLevel * 1.1}s`,
                animationDelay: "0.22s",
              }}
            />
          </>
        ) : null}
        {isConnected ? (
          <AWButton
            variant="contained"
            color="primary"
            iconButton
            className="shadow-[0_8px_20px_rgba(37,99,235,0.35)]"
          >
            <Image src={equalizerIcon} alt="" width={22} height={22} aria-hidden />
          </AWButton>
        ) : (
          <AWButton
            variant="contained"
            size="large"
            isLoading={isConnecting}
            onClick={onStartTalk}
            color="primary"
            className="px-4 py-1.5"
          >
            Start Talk
          </AWButton>
        )}
      </div>

      {isConnected ? (
        <div className="mt-10">
          <AWButton
            variant="contained"
            color="error"
            startIcon={<Image src={endCallIcon} alt="" width={18} height={18} aria-hidden />}
            onClick={onEndTalk}
            className="px-3.5 py-1 shadow-[0_10px_24px_rgba(239,68,68,0.35)]"
          >
            End session
          </AWButton>
        </div>
      ) : null}
    </div>
  )
}
