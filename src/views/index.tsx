import React from "react";

export default {
  TestComponent: React.lazy(() => import("./test-component")),
  Fallback: React.lazy(() => import("./fallback")),
  Dropzone: React.lazy(() => import("./dropzone")),
  PivotTable: React.lazy(() => import("./pivot-table")),
  Json: React.lazy(() => import("./json")),
  Table: React.lazy(() => import("./table")),
};
