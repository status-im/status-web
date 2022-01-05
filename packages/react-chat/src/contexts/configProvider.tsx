import React, { createContext, useContext } from "react";

export type ConfigType = {
  communityKey: string;
  environment: string;
};

const ConfigContext = createContext<ConfigType>({
  communityKey: "",
  environment: "production",
});

export function useConfig() {
  return useContext(ConfigContext);
}

type ConfigProviderProps = {
  children: React.ReactNode;
  config: ConfigType;
};

export function ConfigProvider({ children, config }: ConfigProviderProps) {
  return <ConfigContext.Provider value={config} children={children} />;
}
