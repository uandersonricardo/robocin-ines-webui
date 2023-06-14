import { Flex, Input, Text, Tooltip } from "@chakra-ui/react";
import React from "react";

import { CParamProps } from "./CParam";

const CInput: React.FC<CParamProps> = ({ param }) => {
  return (
    <Flex justify="space-between" align="center" gap="4">
      <Tooltip label={param.description} placement="top">
        <Text fontSize="xs" color="gray.400" flex="4">
          {param.name}
        </Text>
      </Tooltip>
      <Input
        size="xs"
        placeholder={param.name}
        defaultValue={param.value}
        flex="6"
        bg="gray.700"
        color="white"
        border="0"
        _hover={{ bg: "gray.700" }}
        _focus={{ bg: "gray.700" }}
      />
    </Flex>
  );
};

export default CInput;
