"use client";

import { createContextProvider } from "@/contexts/createContextProvider";
import useAgentSessionState from "./useAgentSessionState";

export const [AgentSessionProvider, useAgentSession] =
  createContextProvider(useAgentSessionState);
