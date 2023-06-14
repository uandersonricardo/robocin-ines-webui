import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from "@chakra-ui/react";
import React from "react";

import CParam from "./CParam";

interface CModuleProps {
  module: Module;
}

const CModule: React.FC<CModuleProps> = ({ module }) => {
  return (
    <AccordionItem borderTop="0" borderBottom="1px" borderColor="gray.700">
      <AccordionButton bg="gray.900" _hover={{ bg: "gray.900" }}>
        <Box as="span" flex="1" textAlign="left" color="white" fontSize="sm">
          {module.name}
        </Box>
        <AccordionIcon color="gray.600" />
      </AccordionButton>
      <AccordionPanel display="flex" flexDirection="column" gap="2">
        {module.parameters.map((param, index) => (
          <CParam key={index} param={param} />
        ))}
      </AccordionPanel>
    </AccordionItem>
  );
};

export default CModule;
