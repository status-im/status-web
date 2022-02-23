import { useMemo } from "react";

import { useMessengerContext } from "../contexts/messengerProvider";

export enum NameErrors {
  NoError = 0,
  NameExists = 1,
  BadCharacters = 2,
  EndingWithEth = 3,
  TooLong = 4,
}

export function useNameError(name: string) {
  const { contacts } = useMessengerContext();

  const error = useMemo(() => {
    const RegName = new RegExp("^[a-z0-9_-]+$");
    if (name === "") {
      return NameErrors.NoError;
    }
    const nameExists = Object.values(contacts).find(
      (contact) => contact.trueName === name
    );
    if (nameExists) {
      return NameErrors.NameExists;
    }
    if (!name.match(RegName)) {
      return NameErrors.BadCharacters;
    }
    if (name.slice(-4) === "_eth" || name.slice(-4) === "-eth") {
      return NameErrors.EndingWithEth;
    }
    if (name.length >= 24) {
      return NameErrors.TooLong;
    }
    return NameErrors.NoError;
  }, [name, contacts]);

  return error;
}
