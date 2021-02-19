import React, { useContext, Suspense } from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { Layout, Model, TabNode } from "flexlayout-react";
import viewMap from "./views";
import { StateContext } from "./state-context";
import "./App.css";
import "flexlayout-react/style/light.css";
import { State } from "./types";

const json = {
  global: {
    tabEnableFloat: true,
    // tabClassName: "tabContentFill",
  },
  borders: [],
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "tabset",
        weight: 20,
        selected: 0,
        children: [
          {
            type: "tab",
            name: "Upload File",
            component: "Dropzone",
          },
          {
            type: "tab",
            name: "State Json",
            component: "Json",
            // className: "tabContentFill",
          },
        ],
      },
      {
        type: "tabset",
        weight: 80,
        selected: 0,
        children: [
          {
            type: "tab",
            name: "Table",
            component: "Table",
          },
          {
            type: "tab",
            name: "Pivot",
            component: "PivotTable",
          },
        ],
      },
    ],
  },
};

const factory = (node: TabNode): React.ReactNode => {
  var component = node.getComponent() ?? "Fallback";
  const Component =
    viewMap[component as keyof typeof viewMap] ?? viewMap.Fallback;
  const { state, setState } = useContext(StateContext);
  return (
    <Box
      css={{
        position: "absolute",
        display: "flex",
        alignContent: "stretch",
        alignItems: "stretch",
        justifyContent: "stretch",
        justifyItems: "stretch",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        "*": { flexGrow: 1, height: "auto", width: "auto" },
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Component node={node} state={state} setState={setState}></Component>
      </Suspense>
    </Box>
  );
};

function App() {
  const [model, setModel] = React.useState(() => {
    return Model.fromJson(json);
  });
  const [state, setState] = React.useState<State>(() => {
    return {
      pivotTableState: {
        cols: ["provided"],
        rows: ["provider"],
        vals: [],
        aggregatorName: "Count",
        valueFilter: {},
        rowOrder: "key_a_to_z",
        colOrder: "key_a_to_z",
        derivedAttributes: {},
        rendererName: "Table Heatmap",
        hiddenAttributes: [],
        hiddenFromAggregators: [],
        hiddenFromDragDrop: [],
        unusedOrientationCutoff: 85,
        menuLimit: 500,
      },
      columns: [
        {
          Header: "Name",
          columns: [
            {
              Header: "Provider",
              accessor: "provider",
            },
            {
              Header: "Provided",
              accessor: "provided",
            },
          ],
        },
      ],
    };
  });
  return (
    <StateContext.Provider value={{ state, setState }}>
      <ChakraProvider resetCSS={false}>
        <Layout model={model} factory={factory} />
      </ChakraProvider>
    </StateContext.Provider>
  );
}

export default App;
