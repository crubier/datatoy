import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import XLSX from "xlsx";
import { ViewProps } from "../types";

export const Dropzone = ({ setState }: ViewProps) => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = new Uint8Array((e.target?.result as ArrayBufferLike) || []);
      var workbook = XLSX.read(data, { type: "array" });
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
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};
