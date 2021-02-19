import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { ViewProps } from "../types";

const DropzoneXlsx = ({ setState }: ViewProps) => {
  const onDrop = useCallback((acceptedFiles) => {
    const XLSXPromise = import("xlsx");

    const reader = new FileReader();
    reader.onload = async function (e) {
      const data = new Uint8Array((e.target?.result as ArrayBufferLike) || []);
      const XLSX = await XLSXPromise;
      const workbook = XLSX.read(data, { type: "array" });
      // XLSX.writeFile(workbook, "out.xls");

      setState((previousState) => ({
        ...previousState,
        data: XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]],
          { blankrows: false }
        ),
      }));
    };
    reader.readAsArrayBuffer(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the Excel-compatible files here ...</p>
      ) : (
        <p>
          Drag 'n' drop some Excel-compatible files here, or click to select
          files
        </p>
      )}
    </div>
  );
};

export default DropzoneXlsx;
