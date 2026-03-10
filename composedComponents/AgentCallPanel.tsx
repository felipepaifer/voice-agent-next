"use client"

import { CallSettingsDialog } from "@/composedComponents/CallSettingsDialog"
import { LatencyMetricsCard } from "@/composedComponents/LatencyMetricsCard"
import { VoiceOrb } from "@/composedComponents/VoiceOrb"
import { AgentSessionHandler } from "@/handlers/AgentSessionHandler"
import { useAgentSession } from "@/contexts/agentSession/AgentSessionContext"
import Image from "next/image"
import settingsIcon from "@/assets/svg/settings.svg"
import { useEffect, useMemo, useRef, useState } from "react"
import { Room, RoomEvent, Track } from "livekit-client"

export function AgentCallPanel() {
  // Contexts
  const { setAgentSession, isConnected, setIsConnected } = useAgentSession()

  // States
  const handler = useMemo(() => new AgentSessionHandler(), [])
  const [callSettingsOpen, setCallSettingsOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speakingLevel, setSpeakingLevel] = useState(0)
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([])
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedMicId, setSelectedMicId] = useState("default")
  const [selectedSpeakerId, setSelectedSpeakerId] = useState("default")
  const [speakerSelectionSupported, setSpeakerSelectionSupported] = useState(false)
  const roomRef = useRef<Room | null>(null)
  const remoteAudioRootRef = useRef<HTMLDivElement | null>(null)
  const waitForAgentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const userIdRef = useRef<string>("default-user")
  const remoteAudioElementsRef = useRef<HTMLAudioElement[]>([])

  // Mounted

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    const existing = window.localStorage.getItem("aw_user_id")
    if (existing && existing.trim()) {
      userIdRef.current = existing.trim()
    } else {
      const created = `user-${crypto.randomUUID().slice(0, 8)}`
      userIdRef.current = created
      window.localStorage.setItem("aw_user_id", created)
    }

    setSpeakerSelectionSupported(
      typeof HTMLMediaElement !== "undefined" &&
        "setSinkId" in HTMLMediaElement.prototype
    )
    void refreshDevices()
    const onDeviceChange = () => {
      void refreshDevices()
    }
    navigator.mediaDevices?.addEventListener?.("devicechange", onDeviceChange)

    return () => {
      navigator.mediaDevices?.removeEventListener?.("devicechange", onDeviceChange)
    }
  }, [])

  // Watchers
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    window.localStorage.setItem("aw_audio_input_id", selectedMicId || "default")
  }, [selectedMicId])


  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    window.localStorage.setItem("aw_audio_output_id", selectedSpeakerId || "default")
    remoteAudioElementsRef.current.forEach((audioElement) => {
      void setAudioOutputDevice(audioElement, selectedSpeakerId || "default")
    })
  }, [selectedSpeakerId])


  // Methods
  const setAudioOutputDevice = async (element: HTMLAudioElement, deviceId: string) => {
    const target = element as HTMLAudioElement & {
      setSinkId?: (sinkId: string) => Promise<void>
    }

    if (!target.setSinkId) {
      return
    }

    await target.setSinkId(deviceId || "default")
  }

  const refreshDevices = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices)  return
  
    await navigator.mediaDevices.getUserMedia({ audio: true })
    
    const devices = await navigator.mediaDevices.enumerateDevices()
    const inputs = devices.filter((device) => device.kind === "audioinput")
    const outputs = devices.filter((device) => device.kind === "audiooutput")
    setAudioInputDevices(inputs)
    setAudioOutputDevices(outputs)

    const localMic = window.localStorage.getItem("aw_audio_input_id") || "default"
    const localSpeaker =
      window.localStorage.getItem("aw_audio_output_id") || "default"

    const hasMic = inputs.some((device) => device.deviceId === localMic)
    const hasSpeaker = outputs.some((device) => device.deviceId === localSpeaker)

    setSelectedMicId(hasMic ? localMic : "default")
    setSelectedSpeakerId(hasSpeaker ? localSpeaker : "default")
  }


  const playUiTone = (kind: "start" | "end") => {
    const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    
    const context = new Ctx()
    const now = context.currentTime
    const gain = context.createGain()
    gain.gain.value = 0.0001
    gain.connect(context.destination)

    const first = context.createOscillator()
    first.type = "sine"
    first.frequency.value = kind === "start" ? 640 : 460
    first.connect(gain)

    const second = context.createOscillator()
    second.type = "triangle"
    second.frequency.value = kind === "start" ? 880 : 320
    second.connect(gain)

    gain.gain.exponentialRampToValueAtTime(0.04, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16)
    first.start(now)
    first.stop(now + 0.16)

    gain.gain.exponentialRampToValueAtTime(0.03, now + 0.18)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32)
    second.start(now + 0.16)
    second.stop(now + 0.32)

    window.setTimeout(() => {
      void context.close().catch(() => undefined)
    }, 500)
  }

  const resetSpeakingState = () => {
    setIsSpeaking(false)
    setSpeakingLevel(0)
  }

  const connect = async () => {
    setIsConnecting(true)

    try {
      const identity = `${userIdRef.current}:${crypto.randomUUID().slice(0, 8)}`
      const roomName = `real-estate-demo-${crypto.randomUUID().slice(0, 8)}`
      const session = await handler.createAgentSession(
        identity,
        roomName,
        userIdRef.current
      )
      setAgentSession(session)

      if (!session.canConnect()) {
        return
      }

      const room = new Room({
        audioCaptureDefaults: {
          deviceId: selectedMicId,
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: true,
        },
      })
      roomRef.current = room

      room.on(RoomEvent.ParticipantConnected, () => {})

      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind !== Track.Kind.Audio) {
          return
        }
        const audioElement = track.attach()
        audioElement.autoplay = true
        remoteAudioElementsRef.current.push(audioElement)

        void setAudioOutputDevice(audioElement, selectedSpeakerId || "default")
        
        if (remoteAudioRootRef.current) {
          remoteAudioRootRef.current.appendChild(audioElement)
        }

        void audioElement.play()
      })

      room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        const remoteSpeakers = speakers.filter(
          (speaker) => speaker.identity !== identity
        )

        if (remoteSpeakers.length === 0) {
          setIsSpeaking(false)
          setSpeakingLevel((prev) => prev * 0.7)
          return
        }

        const maxLevel = Math.max(
          ...remoteSpeakers.map((speaker) => speaker.audioLevel ?? 0)
        )
        const normalizedLevel = Math.min(1, Math.max(0, maxLevel * 3.2))
        setIsSpeaking(normalizedLevel > 0.06)
        setSpeakingLevel((prev) => Math.max(normalizedLevel, prev * 0.75))
      })

      room.on(RoomEvent.TrackUnsubscribed, (track) => {
        track.detach().forEach((element) => element.remove())
        remoteAudioElementsRef.current = remoteAudioElementsRef.current.filter(
          (audioElement) => audioElement.isConnected
        )
        resetSpeakingState()
      })
      room.on(RoomEvent.Disconnected, (reason) => {
        resetSpeakingState()
        setIsConnected(false)
      })

      await room.connect(session.url, session.token as string)
      await room.localParticipant.setMicrophoneEnabled(true)
      playUiTone("start")

      setIsConnected(true)
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Connection failed.")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = async () => {
    if (waitForAgentTimerRef.current) {
      clearTimeout(waitForAgentTimerRef.current)
      waitForAgentTimerRef.current = null
    }
    const room = roomRef.current
    if (room) {
      room.disconnect()
      roomRef.current = null
    }
    if (remoteAudioRootRef.current) {
      remoteAudioRootRef.current.innerHTML = ""
    }
    remoteAudioElementsRef.current = []
    resetSpeakingState()
    playUiTone("end")
    setIsConnected(false)
  }

  const startTalk = () => {
    if (isConnected || isConnecting) {
      return
    }
    void connect()
  }

  
  return (
    <div
      className="relative w-full min-h-[calc(100vh-16px)] overflow-hidden rounded-xl border border-slate-400/20 p-2 shadow-[0_30px_90px_rgba(2,8,23,0.55),inset_0_1px_0_rgba(255,255,255,0.03)] sm:min-h-[calc(100vh-32px)] sm:rounded-3xl sm:p-3"
      style={{
        background:
          "radial-gradient(1000px circle at 8% 10%, rgba(59, 130, 246, 0.24), rgba(2, 6, 23, 0.95) 45%), radial-gradient(900px circle at 92% 88%, rgba(14, 116, 144, 0.18), rgba(2, 6, 23, 0.98) 50%), #010617",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(110deg, rgba(148,163,184,0.06) 0%, rgba(148,163,184,0.0) 38%, rgba(14,165,233,0.08) 100%)",
        }}
      />
      <div className="flex w-full justify-end gap-2">
        <button
          type="button"
          aria-label="Settings"
          title="Settings"
          onClick={() => setCallSettingsOpen(true)}
          className="rounded-full border border-slate-400/25 bg-slate-900/60 p-2 text-slate-300 transition hover:bg-slate-800/70"
        >
          <Image src={settingsIcon} alt="" width={20} height={20} aria-hidden />
        </button>
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-170px)] items-stretch justify-center gap-2 sm:min-h-[calc(100vh-180px)]">
        <div className="grid min-h-[360px] place-items-center sm:min-h-[500px]">
          <VoiceOrb
            isConnected={isConnected}
            isConnecting={isConnecting}
            isSpeaking={isSpeaking}
            speakingLevel={speakingLevel}
            onStartTalk={startTalk}
            onEndTalk={() => void disconnect()}
          />
        </div>
      </div>

      <div ref={remoteAudioRootRef} />
      <CallSettingsDialog
        open={callSettingsOpen}
        onClose={() => setCallSettingsOpen(false)}
        audioInputDevices={audioInputDevices}
        audioOutputDevices={audioOutputDevices}
        selectedMicId={selectedMicId}
        selectedSpeakerId={selectedSpeakerId}
        speakerSelectionSupported={speakerSelectionSupported}
        onChangeMic={setSelectedMicId}
        onChangeSpeaker={setSelectedSpeakerId}
        onRefreshDevices={refreshDevices}
        userId={userIdRef.current}
      />
      <LatencyMetricsCard />
    </div>
  )
}
