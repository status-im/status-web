import React, { createContext, useContext } from "react";

export type ConfigType = {
  environment: string;
  dappUrl: string;
};

const ConfigContext = createContext<ConfigType>({
  environment: "production",
  dappUrl: "",
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
