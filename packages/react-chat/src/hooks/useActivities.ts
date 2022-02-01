import { bufToHex } from "@waku/status-communities/dist/cjs/utils";
import { useEffect, useMemo, useReducer } from "react";

import { useIdentity } from "../contexts/identityProvider";
import { useMessengerContext } from "../contexts/messengerProvider";
import { Activities, Activity, ActivityStatus } from "../models/Activity";
import { ChatMessage } from "../models/ChatMessage";

export type ActivityAction =
  | { type: "addActivity"; payload: Activity }
  | { type: "removeActivity"; payload: "string" }
  | { type: "setAsRead"; payload: string }
  | { type: "setAllAsRead" }
  | { type: "setStatus"; payload: { id: string; status: ActivityStatus } };

function activityReducer(
  state: Activities,
  action: ActivityAction
): Activities {
  switch (action.type) {
    case "setStatus": {
      const activity = state[action.payload.id];
      if (activity && "status" in activity) {
        activity.status = action.payload.status;
        activity.isRead = true;
        return { ...state, [activity.id]: activity };
      }
      return state;
    }
    case "setAsRead": {
      const activity = state[action.payload];
      if (activity) {
        activity.isRead = true;
        return { ...state, [activity.id]: activity };
      }
      return state;
    }
    case "setAllAsRead": {
      return Object.entries(state).reduce((prev, curr) => {
        const activity = curr[1];
        activity.isRead = true;
        return { ...prev, [curr[0]]: activity };
      }, {});
    }
    case "addActivity": {
      return { ...state, [action.payload.id]: action.payload };
    }
    case "removeActivity": {
      if (state[action.payload]) {
        const newState = { ...state };
        delete newState[action.payload];
        return newState;
      } else {
        return state;
      }
    }
    default:
      throw new Error("Wrong activity reducer type");
  }
}

export function useActivities() {
  const [activitiesObj, dispatch] = useReducer(activityReducer, {});
  const activities = useMemo(
    () => Object.values(activitiesObj),
    [activitiesObj]
  );
  const identity = useIdentity();
  const userPK = useMemo(
    () => (identity ? bufToHex(identity.publicKey) : undefined),
    [identity]
  );
  const { subscriptionsDispatch, channels } = useMessengerContext();

  useEffect(() => {
    if (identity) {
      const subscribeFunction = (message: ChatMessage, id: string) => {
        if (message.quote && identity && message.quote.sender === userPK) {
          const newActivity: Activity = {
            id: message.date.getTime().toString() + message.content,
            type: "reply",
            date: message.date,
            user: message.sender,
            message: message,
            channel: channels[id],
            quote: message.quote,
          };
          dispatch({ type: "addActivity", payload: newActivity });
        }

        const split = message.content.split(" ");
        const userMentioned = split.some(
          (fragment) => fragment.startsWith("@") && fragment.slice(1) == userPK
        );
        if (userMentioned) {
          const newActivity: Activity = {
            id: message.date.getTime().toString() + message.content,
            type: "mention",
            date: message.date,
            user: message.sender,
            message: message,
            channel: channels[id],
          };
          dispatch({ type: "addActivity", payload: newActivity });
        }
      };
      subscriptionsDispatch({
        type: "addSubscription",
        payload: { name: "activityCenter", subFunction: subscribeFunction },
      });
    }
    return () =>
      subscriptionsDispatch({
        type: "removeSubscription",
        payload: { name: "activityCenter" },
      });
  }, [subscriptionsDispatch, identity]);

  return { activities, activityDispatch: dispatch };
}
