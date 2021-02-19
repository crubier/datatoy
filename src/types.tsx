import { TabNode } from "flexlayout-react";

export type State = {
  columns?: Array<{}>;
  pivotTableState?: {};
  data?: Array<{}>;
};

export type StateContextType = {
  state: State;
  setState: React.Dispatch<React.SetStateAction<{}>>;
};

export type ViewProps = StateContextType & {
  node: TabNode;
};
