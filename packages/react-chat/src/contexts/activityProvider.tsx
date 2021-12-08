import React, { createContext, useContext, useState } from "react";

import { Activity } from "../models/Activity";

const ActivityContext = createContext<{
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}>({
  activities: [],
  setActivities: () => undefined,
});

export function useActivities() {
  return useContext(ActivityContext);
}

interface ActivityProviderProps {
  children: React.ReactNode;
}

export function ActivityProvider({ children }: ActivityProviderProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  return (
    <ActivityContext.Provider
      value={{ activities, setActivities }}
      children={children}
    />
  );
}
