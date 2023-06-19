import { Button, Flex, IconButton, Input } from "@chakra-ui/react";
import React from "react";
import { RiDownload2Fill, RiSearch2Line, RiUpload2Fill } from "react-icons/ri";

import params from "@/assets/params.json";

import CModules from "../components/CModules";

const CSidebarParams: React.FC = () => {
  return (
    <Flex direction="column" bg="gray.900" borderRight="1px" borderColor="gray.700" color="white" h="full" minW="60">
      <Flex gap="2" p="2" borderBottom="1px" borderColor="gray.700">
        <Button flex="1" size="sm" leftIcon={<RiDownload2Fill />}>
          Import
        </Button>
        <Button flex="1" size="sm" leftIcon={<RiUpload2Fill />}>
          Export
        </Button>
      </Flex>
      <Flex gap="2" p="2" borderBottom="1px" borderColor="gray.700">
        <Input size="sm" placeholder="Search" bg="gray.800" borderRadius="4" _placeholder={{ color: "gray.400" }} />
        <IconButton aria-label="Search" icon={<RiSearch2Line />} size="sm" bg="green.500" />
      </Flex>
      <Flex dir="column" flex="1" w="full">
        <CModules modules={params.modules} />
      </Flex>
      <Flex p="2">
        <Button w="full" size="sm" bg="green.500">
          Send
        </Button>
      </Flex>
    </Flex>
  );
};

export default CSidebarParams;
