export type AgentPersona = {
  name: string;
  greeting: string;
  voice: string;
};

export type AgentTools = {
  check_availability: boolean;
  schedule_viewing: boolean;
  google_calendar_mcp: boolean;
  send_sms_confirmation: boolean;
};

export type AgentNotifications = {
  default_phone: string;
  use_default_phone: boolean;
  require_phone_confirmation: boolean;
};

type AgentSettingsApiResponse = {
  system_prompt: string;
  persona: AgentPersona;
  tools: Partial<AgentTools>;
  notifications?: Partial<AgentNotifications>;
};

type AgentSettingsConstructorInput =
  | AgentSettingsApiResponse
  | {
      systemPrompt: string;
      persona: AgentPersona;
      tools: Partial<AgentTools>;
      notifications?: Partial<AgentNotifications>;
    };

const DEFAULT_TOOLS: AgentTools = {
  check_availability: true,
  schedule_viewing: true,
  google_calendar_mcp: true,
  send_sms_confirmation: true,
};

const DEFAULT_NOTIFICATIONS: AgentNotifications = {
  default_phone: "",
  use_default_phone: false,
  require_phone_confirmation: true,
};

export class AgentSettings {
  public systemPrompt: string;
  public persona: AgentPersona;
  public tools: AgentTools;
  public notifications: AgentNotifications;

  constructor(data: AgentSettingsConstructorInput) {
    if ("system_prompt" in data) {
      this.systemPrompt = data.system_prompt;
      this.persona = data.persona;
      this.tools = { ...DEFAULT_TOOLS, ...(data.tools ?? {}) };
      this.notifications = {
        ...DEFAULT_NOTIFICATIONS,
        ...(data.notifications ?? {}),
      };
      return;
    }

    this.systemPrompt = data.systemPrompt;
    this.persona = data.persona;
    this.tools = { ...DEFAULT_TOOLS, ...(data.tools ?? {}) };
    this.notifications = {
      ...DEFAULT_NOTIFICATIONS,
      ...(data.notifications ?? {}),
    };
  }

  static fromApi(data: AgentSettingsApiResponse): AgentSettings {
    return new AgentSettings(data);
  }

  toApi(): AgentSettingsApiResponse {
    return {
      system_prompt: this.systemPrompt,
      persona: this.persona,
      tools: this.tools,
      notifications: this.notifications,
    };
  }
}
