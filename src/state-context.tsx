import { createContext } from "react";
import { StateContextType } from "./types";

export const StateContext = createContext<StateContextType>({
  state: {},
  setState: () => {
    return;
  },
});
