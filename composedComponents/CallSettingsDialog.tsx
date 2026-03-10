"use client";

import { AWButton } from "@/components/AWButton";
import { AWDialog } from "@/components/AWDialog";
import { AWTextInput } from "@/components/AWTextInput";
import { AgentSettingsForm } from "@/composedComponents/AgentSettingsForm";
import { useAgentSettings } from "@/contexts/agentSettings/AgentSettingsContext";
import { AgentSettingsHandler } from "@/handlers/AgentSettingsHandler";
import { GoogleCalendarHandler } from "@/handlers/GoogleCalendarHandler";
import { AgentSettings } from "@/models/AgentSettings";
import { useEffect, useMemo, useState } from "react";

type CallSettingsDialogProps = {
  open: boolean;
  onClose: () => void;
  audioInputDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
  selectedMicId: string;
  selectedSpeakerId: string;
  speakerSelectionSupported: boolean;
  onChangeMic: (deviceId: string) => void;
  onChangeSpeaker: (deviceId: string) => void;
  onRefreshDevices: () => Promise<void>;
  userId: string;
};

export function CallSettingsDialog({
  open,
  onClose,
  audioInputDevices,
  audioOutputDevices,
  selectedMicId,
  selectedSpeakerId,
  speakerSelectionSupported,
  onChangeMic,
  onChangeSpeaker,
  onRefreshDevices,
  userId,
}: CallSettingsDialogProps) {
  // Contexts
  const { agentSettings, setAgentSettings } = useAgentSettings()

  // States
  const handler = useMemo(() => new AgentSettingsHandler(), [])
  const calendarHandler = useMemo(() => new GoogleCalendarHandler(), [])
  const [activeTab, setActiveTab] = useState<
    "audio" | "agent" | "integrations" | "notifications"
  >("audio")
  const [isSaving, setIsSaving] = useState(false)
  const [isCalendarBusy, setIsCalendarBusy] = useState(false)
  const [calendarConnected, setCalendarConnected] = useState(false)
  const [draftSettings, setDraftSettings] = useState<AgentSettings | null>(null)

  // Derived values
  const hasMicDevices = audioInputDevices.length > 0
  const hasSpeakerDevices = audioOutputDevices.length > 0
  const currentSettings = draftSettings ?? agentSettings
  const supportsSave = activeTab === "agent" || activeTab === "notifications"
  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 40px 10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(148, 163, 184, 0.3)",
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    color: "#e2e8f0",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5' stroke='%2394a3b8' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    backgroundSize: "12px 12px",
  }

  // Watchers
  useEffect(() => {
    if (!open) {
      return;
    }
    setActiveTab("audio");
    setDraftSettings(null);
  }, [open]);

  useEffect(() => {
    if (!open || !userId) {
      return;
    }
    void calendarHandler
      .status(userId)
      .then((result) => setCalendarConnected(Boolean(result.connected)))
      .catch(() => setCalendarConnected(false));
  }, [calendarHandler, open, userId]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onOAuthMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; status?: string } | null;
      if (!data || data.type !== "google-calendar-oauth") {
        return;
      }
      if (data.status === "connected") {
        setCalendarConnected(true);
      }
      setIsCalendarBusy(false);
    };
    window.addEventListener("message", onOAuthMessage);
    return () => window.removeEventListener("message", onOAuthMessage);
  }, [open]);

  // Methods
  const handleMicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeMic(event.target.value || "default");
  };

  const handleSpeakerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeSpeaker(event.target.value || "default");
  };

  const handleSaveAgentSettings = async () => {
    if (!currentSettings) {
      return;
    }
    const settingsToSave = new AgentSettings({
      systemPrompt: currentSettings.systemPrompt,
      persona: currentSettings.persona,
      tools: currentSettings.tools,
      notifications: {
        ...currentSettings.notifications,
        use_default_phone: true,
        require_phone_confirmation: false,
      },
    });
    setIsSaving(true);
    try {
      const saved = await handler.updateAgentSettings(settingsToSave);
      setAgentSettings(saved);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleConnectCalendar = async () => {
    if (!userId) {
      return;
    }
    try {
      setIsCalendarBusy(true);
      const authUrl = await calendarHandler.connect(userId);
      const popupWidth = 560;
      const popupHeight = 760;
      const left = Math.max(0, Math.floor(window.screenX + (window.outerWidth - popupWidth) / 2));
      const top = Math.max(0, Math.floor(window.screenY + (window.outerHeight - popupHeight) / 2));
      const popup = window.open(
        authUrl,
        "google-calendar-oauth",
        `popup=yes,width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no`
      );
      popup?.focus();
    } catch {
      setIsCalendarBusy(false);
    }
  };

  const handleDisconnectCalendar = async () => {
    if (!userId) {
      return;
    }
    try {
      setIsCalendarBusy(true);
      await calendarHandler.disconnect(userId);
      setCalendarConnected(false);
    } finally {
      setIsCalendarBusy(false);
    }
  };

  return (
    <AWDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title="Settings"
      actions={
        <>
          {activeTab === "audio" ? (
            <AWButton variant="text" onClick={() => void onRefreshDevices()}>
              Refresh devices
            </AWButton>
          ) : supportsSave ? (
            <AWButton variant="text" onClick={onClose}>
              Cancel
            </AWButton>
          ) : null}
          {activeTab === "integrations" ? (
            <AWButton variant="contained" onClick={onClose}>
              Done
            </AWButton>
          ) : activeTab === "audio" ? (
            <AWButton variant="contained" onClick={onClose}>
              Done
            </AWButton>
          ) : null}
          {supportsSave ? (
            <AWButton
              variant="contained"
              onClick={() => void handleSaveAgentSettings()}
              isLoading={isSaving}
            >
              Save
            </AWButton>
          ) : null}
        </>
      }
    >
      <div style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            display: "inline-flex",
            gap: 8,
            border: "1px solid rgba(148, 163, 184, 0.28)",
            borderRadius: 999,
            padding: 4,
            width: "fit-content",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("audio")}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "6px 12px",
              background:
                activeTab === "audio"
                  ? "rgba(59, 130, 246, 0.28)"
                  : "transparent",
              color: "#e2e8f0",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Audio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("agent")}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "6px 12px",
              background:
                activeTab === "agent"
                  ? "rgba(59, 130, 246, 0.28)"
                  : "transparent",
              color: "#e2e8f0",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Agent
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("integrations")}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "6px 12px",
              background:
                activeTab === "integrations"
                  ? "rgba(59, 130, 246, 0.28)"
                  : "transparent",
              color: "#e2e8f0",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Integrations
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "6px 12px",
              background:
                activeTab === "notifications"
                  ? "rgba(59, 130, 246, 0.28)"
                  : "transparent",
              color: "#e2e8f0",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Notifications
          </button>
        </div>

        {activeTab === "audio" ? (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <label className="font-semibold" htmlFor="microphone-select">
                Microphone
              </label>
              <select
                id="microphone-select"
                value={selectedMicId}
                onChange={handleMicChange}
                disabled={!hasMicDevices}
                style={selectStyle}
              >
                {audioInputDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || "Unknown microphone"}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label className="font-semibold" htmlFor="speaker-select">
                Speaker
              </label>
              <select
                id="speaker-select"
                value={selectedSpeakerId}
                onChange={handleSpeakerChange}
                disabled={!speakerSelectionSupported || !hasSpeakerDevices}
                style={selectStyle}
              >
                {audioOutputDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || "Unknown speaker"}
                  </option>
                ))}
              </select>
            </div>

            {!speakerSelectionSupported ? (
              <div style={{ color: "#94a3b8", fontSize: 13 }}>
                Speaker selection is not supported by this browser.
              </div>
            ) : null}
          </div>
        ) : activeTab === "agent" && currentSettings ? (
          <AgentSettingsForm
            settings={currentSettings}
            onChange={(value) => setDraftSettings(value)}
          />
        ) : activeTab === "integrations" ? (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ fontSize: 13, color: "#94a3b8" }}>
              Integrations are shown as cards so new providers can be added easily.
            </div>

            <div
              style={{
                border: "1px solid rgba(148, 163, 184, 0.3)",
                borderRadius: 12,
                padding: 14,
                background: "rgba(15, 23, 42, 0.45)",
                display: "grid",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "grid", gap: 4 }}>
                  <div style={{ fontWeight: 700, color: "#e2e8f0" }}>
                    Google Calendar
                  </div>
                  <div style={{ fontSize: 13, color: "#94a3b8" }}>
                    Create calendar events automatically when viewings are scheduled.
                  </div>
                </div>
                <div
                  style={{
                    alignSelf: "start",
                    fontSize: 12,
                    fontWeight: 700,
                    color: calendarConnected ? "#22c55e" : "#f59e0b",
                  }}
                >
                  {calendarConnected ? "Connected" : "Disconnected"}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                {calendarConnected ? (
                  <AWButton
                    variant="outlined"
                    onClick={() => void handleDisconnectCalendar()}
                    disabled={isCalendarBusy}
                    isLoading={isCalendarBusy}
                  >
                    Disconnect
                  </AWButton>
                ) : (
                  <AWButton
                    variant="contained"
                    onClick={() => void handleConnectCalendar()}
                    disabled={isCalendarBusy}
                    isLoading={isCalendarBusy}
                  >
                    Connect
                  </AWButton>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === "notifications" && currentSettings ? (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <label className="font-semibold" htmlFor="default-phone">
                Default confirmation phone
              </label>
              <AWTextInput
                id="default-phone"
                value={currentSettings.notifications.default_phone}
                placeholder="+5521971587779"
                onChange={(event) =>
                  setDraftSettings(
                    new AgentSettings({
                      systemPrompt: currentSettings.systemPrompt,
                      persona: currentSettings.persona,
                      tools: currentSettings.tools,
                      notifications: {
                        ...currentSettings.notifications,
                        default_phone: event.target.value,
                        use_default_phone: true,
                        require_phone_confirmation: false,
                      },
                    })
                  )
                }
              />
            </div>
            <div style={{ color: "#94a3b8", fontSize: 13 }}>
              SMS confirmations always use this saved number.
            </div>
          </div>
        ) : null}
      </div>
    </AWDialog>
  );
}
