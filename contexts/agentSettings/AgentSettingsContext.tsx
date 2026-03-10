"use client";

import { createContextProvider } from "@/contexts/createContextProvider";
import useAgentSettingsState from "./useAgentSettingsState";

export const [AgentSettingsProvider, useAgentSettings] =
  createContextProvider(useAgentSettingsState);
