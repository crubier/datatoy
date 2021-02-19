import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { ViewProps } from "../types";

const Dropzone = ({ setState }: ViewProps) => {
  const onDrop = useCallback((acceptedFiles) => {
    const PapaPromise = import("papaparse");

    const reader = new FileReader();
    reader.onload = async function (e) {
      const rawData = e.target?.result as string;

      const Papa = await PapaPromise;
      const { data } = Papa.parse(rawData, { header: true });

      setState((previousState) => ({
        ...previousState,
        data: data,
      }));
    };
    reader.readAsText(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the CSV files here ...</p>
      ) : (
        <p>Drag 'n' drop some CSV files here, or click to select files</p>
      )}
    </div>
  );
};

export default Dropzone;
