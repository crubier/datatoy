import React from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import TableRenderers from "react-pivottable/TableRenderers";
import createPlotlyComponent from "react-plotly.js/factory";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import { Helmet } from "react-helmet";
import { State, ViewProps } from "../types";

// create Plotly React component via dependency injection
const Plot = createPlotlyComponent(window.Plotly);

// create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);
const renderers = Object.assign({}, TableRenderers, PlotlyRenderers);
export const PivotTable = ({ state, setState }: ViewProps) => {
  return (
    <>
      <Helmet>
        <script
          src="https://cdn.plot.ly/plotly-latest.min.js"
          charset="utf-8"
        ></script>
      </Helmet>
      <PivotTableUI
        data={state?.data ?? []}
        onChange={({ data, ...s }: {}) =>
          setState(
            (previousState: State): State => ({
              ...previousState,
              pivotTableState: s,
            })
          )
        }
        renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
        {...state.pivotTableState}
      />
    </>
  );
};
