import { Accordion } from "@chakra-ui/react";
import React from "react";

import CModule from "./CModule";

interface CModulesProps {
  modules: Module[];
}

const CModules: React.FC<CModulesProps> = ({ modules }) => {
  return (
    <Accordion allowToggle w="full">
      {modules.map((module, index) => (
        <CModule key={index} module={module} />
      ))}
    </Accordion>
  );
};

export default CModules;
