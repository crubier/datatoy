import { Textarea } from "@chakra-ui/react";
import React from "react";
import { ViewProps } from "../types";
export const Json = ({ state: { data, ...rest }, node }: ViewProps) => {
  const handleInputChange = () => {
    return;
  };
  return (
    <Textarea
      className={node.getClassName()}
      value={JSON.stringify(rest, null, 2)}
      onChange={handleInputChange}
      height="auto"
    ></Textarea>
  );
};
