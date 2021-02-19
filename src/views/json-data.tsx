import { Textarea } from "@chakra-ui/react";
import React from "react";
import { ViewProps } from "../types";
const Json = ({ state: { data }, node }: ViewProps) => {
  const handleInputChange = () => {
    return;
  };
  return (
    <Textarea
      className={node.getClassName()}
      value={JSON.stringify(data, null, 2)}
      onChange={handleInputChange}
      height="auto"
    ></Textarea>
  );
};
export default Json;
