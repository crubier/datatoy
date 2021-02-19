import React from "react";
import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useGroupBy,
  useExpanded,
  useRowSelect,
  Column,
} from "react-table";
import { State, ViewProps } from "../types";
import { matchSorter } from "match-sorter";
import { Box, CSSObject } from "@chakra-ui/react";

const boxStyle: CSSObject = {
  padding: "1rem",
  width: "auto",
  flexGrow: 1,
  height: "auto",
  table: {
    borderSpacing: 0,
    border: "1px solid black",
    tr: {
      ":last-child": {
        td: {
          borderBottom: 0,
        },
      },
    },
    th: {
      margin: 0,
      padding: "0.5rem",
      borderBottom: "1px solid black",
      borderRight: "1px solid black",
      ":last-child": {
        borderRight: 0,
      },
    },
    td: {
      margin: 0,
      padding: "0.5rem",
      borderBottom: "1px solid black",
      borderRight: "1px solid black",
      ":last-child": {
        borderRight: 0,
      },
      input: {
        fontSize: "1rem",
        padding: 0,
        margin: 0,
        border: 0,
      },
    },
  },
};

// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateData, // This is a custom function that we supplied to our table instance
  editable,
}: {
  value: any;
  row: { index: number };
  column: { id: string };
  updateData: (rowIndex: number, columnId: string, value: any) => void; // This is a custom function that we supplied to our table instance
  editable: boolean;
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateData(index, id, value);
  };

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!editable) {
    return `${initialValue}`;
  }

  return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

// Define a default UI for filtering
function DefaultColumnFilter({
  // @ts-ignore
  column: { filterValue, preFilteredRows, setFilter },
}: {
  column: Column;
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  // @ts-ignore
  column: { filterValue, setFilter, preFilteredRows, id },
}: {
  column: Column;
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row: any) => {
      // @ts-ignore
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    // @ts-ignore
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        // @ts-ignore
        <option key={i} value={option}>
          {/* @ts-ignore */}
          {option}
        </option>
      ))}
    </select>
  );
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
function SliderColumnFilter({
  // @ts-ignore
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    // @ts-ignore
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={(e) => {
          setFilter(parseInt(e.target.value, 10));
        }}
      />
      <button onClick={() => setFilter(undefined)}>Off</button>
    </>
  );
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({
  // @ts-ignore
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    // @ts-ignore
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <input
        value={filterValue[0] || ""}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [
            val ? parseInt(val, 10) : undefined,
            old[1],
          ]);
        }}
        placeholder={`Min (${min})`}
        style={{
          width: "70px",
          marginRight: "0.5rem",
        }}
      />
      to
      <input
        value={filterValue[1] || ""}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [
            old[0],
            val ? parseInt(val, 10) : undefined,
          ]);
        }}
        placeholder={`Max (${max})`}
        style={{
          width: "70px",
          marginLeft: "0.5rem",
        }}
      />
    </div>
  );
}
// @ts-ignore
function fuzzyTextFilterFn(rows, id, filterValue) {
  // @ts-ignore
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
// @ts-ignore
fuzzyTextFilterFn.autoRemove = (val) => !val;

// Define a custom filter filter function!
// @ts-ignore
function filterGreaterThan(rows, id, filterValue) {
  // @ts-ignore
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
// @ts-ignore
filterGreaterThan.autoRemove = (val) => typeof val !== "number";

// This is a custom aggregator that
// takes in an array of leaf values and
// returns the rounded median
// @ts-ignore
function roundedMedian(leafValues) {
  let min = leafValues[0] || 0;
  let max = leafValues[0] || 0;

  // @ts-ignore
  leafValues.forEach((value) => {
    min = Math.min(min, value);
    max = Math.max(max, value);
  });

  return Math.round((min + max) / 2);
}

const IndeterminateCheckbox = React.forwardRef(
  // @ts-ignore
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      // @ts-ignore
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        {/* @ts-ignore */}
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

const RealTable = ({
  state,
  updateData,
  skipReset,
}: ViewProps & {
  updateData: (rowIndex: number, columnId: string, value: any) => void;
  skipReset: boolean;
}) => {
  // const {
  //   getTableProps,
  //   getTableBodyProps,
  //   headerGroups,
  //   rows,
  //   prepareRow,
  // } = useTable({
  //   columns: state.columns as Column<{}>[],
  //   data: state.data as {}[],
  // });

  // // Render the UI for your table
  // return (
  //   <table {...getTableProps()}>
  //     <thead>
  //       {headerGroups.map((headerGroup) => (
  //         <tr {...headerGroup.getHeaderGroupProps()}>
  //           {headerGroup.headers.map((column) => (
  //             <th {...column.getHeaderProps()}>{column.render("Header")}</th>
  //           ))}
  //         </tr>
  //       ))}
  //     </thead>
  //     <tbody {...getTableBodyProps()}>
  //       {rows.map((row, i) => {
  //         prepareRow(row);
  //         return (
  //           <tr {...row.getRowProps()}>
  //             {row.cells.map((cell) => {
  //               return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
  //             })}
  //           </tr>
  //         );
  //       })}
  //     </tbody>
  //   </table>
  // );

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      // @ts-ignore
      text: (rows, id, filterValue) => {
        // @ts-ignore
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
      // And also our default editable cell
      Cell: EditableCell,
    }),
    []
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    // page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    // canPreviousPage,
    // canNextPage,
    // pageOptions,
    // pageCount,
    // gotoPage,
    // nextPage,
    // previousPage,
    // setPageSize,

    state: {
      // pageIndex,
      // pageSize,
      // @ts-ignore
      sortBy,
      // @ts-ignore
      groupBy,
      // @ts-ignore
      expanded,
      // @ts-ignore
      filters,
      // @ts-ignore
      selectedRowIds,
    },
  } = useTable(
    {
      columns: state.columns as Column<{}>[],

      data: state.data as {}[],
      defaultColumn,
      // @ts-ignore
      filterTypes,
      // updateData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateData,
      // We also need to pass this so the page doesn't change
      // when we edit the data.
      autoResetPage: !skipReset,
      autoResetSelectedRows: !skipReset,
      disableMultiSort: true,
      initialState: state.tableState,
    },
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded,
    // usePagination,
    useRowSelect,
    // Here we will use a plugin to add our selection column
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        return [
          {
            id: "selection",
            // Make this column a groupByBoundary. This ensures that groupBy columns
            // are placed after it
            groupByBoundary: true,
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            // @ts-ignore
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox
                  {
                    // @ts-ignore
                    ...row.getToggleRowSelectedProps()
                  }
                />
              </div>
            ),
          },
          ...columns,
        ];
      });
    }
  );

  return (
    // @ts-ignore
    <Box css={boxStyle}>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  <div>
                    {
                      // @ts-ignore
                      column.canGroupBy ? (
                        // If the column can be grouped, let's add a toggle
                        // @ts-ignore
                        <span {...column.getGroupByToggleProps()}>
                          {
                            // @ts-ignore
                            column.isGrouped ? "🛑 " : "👊 "
                          }
                        </span>
                      ) : null
                    }
                    <span
                      {
                        // @ts-ignore
                        ...column.getSortByToggleProps()
                      }
                    >
                      {column.render("Header")}
                      {/* Add a sort direction indicator */}
                      {
                        // @ts-ignore
                        column.isSorted
                          ? // @ts-ignore
                            column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""
                      }
                    </span>
                  </div>
                  {/* Render the columns filter UI */}
                  <div>
                    {
                      // @ts-ignore
                      column.canFilter ? column.render("Filter") : null
                    }
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>
                      {
                        // @ts-ignore
                        cell.isGrouped ? (
                          // If it's a grouped cell, add an expander and row count
                          <>
                            <span
                              {
                                // @ts-ignore
                                ...row.getToggleRowExpandedProps()
                              }
                            >
                              {
                                // @ts-ignore
                                row.isExpanded ? "👇" : "👉"
                              }
                            </span>{" "}
                            {
                              // @ts-ignore
                              cell.render("Cell", { editable: false })
                            }{" "}
                            ({row.subRows.length})
                          </>
                        ) : // @ts-ignore
                        cell.isAggregated ? (
                          // If the cell is aggregated, use the Aggregated
                          // renderer for cell
                          cell.render("Aggregated")
                        ) : // @ts-ignore
                        cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                          // Otherwise, just render the regular cell
                          cell.render("Cell", { editable: true })
                        )
                      }
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/*
      Pagination can be built however you'd like.
      This is just a very basic UI implementation:
    */}
      {/* <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div> */}
      <pre>
        <code>
          {JSON.stringify(
            {
              // pageIndex,
              // pageSize,
              // pageCount,
              // canNextPage,
              // canPreviousPage,
              sortBy,
              groupBy,
              expanded,
              filters,
              selectedRowIds,
            },
            null,
            2
          )}
        </code>
      </pre>
    </Box>
  );
};

const Table = (a: ViewProps) => {
  // When our cell renderer calls updateData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateData = (rowIndex: number, columnId: string, value: any): void => {
    // We also turn on the flag to not reset the page
    // skipResetRef.current = true;
    return a.setState(
      (previousState: State): State => ({
        ...previousState,
        data:
          previousState?.data?.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...row,
                [columnId]: value,
              };
            }
            return row;
          }) ?? previousState?.data,
      })
    );
  };

  if (!a.state.data) {
    return <div>No Data</div>;
  }
  return <RealTable {...a} updateData={updateData} skipReset={false} />;
};

export default Table;
