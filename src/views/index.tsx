import React from "react";

export default {
  TestComponent: React.lazy(() => import("./test-component")),
  Fallback: React.lazy(() => import("./fallback")),
  DropzoneCsv: React.lazy(() => import("./dropzone-csv")),
  DropzoneXlsx: React.lazy(() => import("./dropzone-xlsx")),
  PivotTable: React.lazy(() => import("./pivot-table")),
  JsonData: React.lazy(() => import("./json-data")),
  JsonState: React.lazy(() => import("./json-state")),
  Table: React.lazy(() => import("./table")),
  // GraphVis: React.lazy(() => import("./graph-vis")),
};
