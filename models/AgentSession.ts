type AgentSessionApiResponse = {
  token?: string;
  room: string;
  identity: string;
  url: string;
  error?: string;
};

export class AgentSession {
  public room: string;
  public identity: string;
  public url: string;
  public token?: string;
  public error?: string;

  constructor(data: AgentSessionApiResponse) {
    this.room = data.room;
    this.identity = data.identity;
    this.url = data.url;
    this.token = data.token;
    this.error = data.error;
  }

  static fromApi(data: AgentSessionApiResponse): AgentSession {
    return new AgentSession(data);
  }

  canConnect(): boolean {
    return Boolean(this.token && this.url && !this.error);
  }
}
