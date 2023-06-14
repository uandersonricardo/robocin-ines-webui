import {
  Button,
  Flex,
  IconButton,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  TabPanel,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { RiDownload2Fill, RiPlayFill, RiSearch2Line, RiStopFill, RiUpload2Fill } from "react-icons/ri";

import field from "@/assets/field.jpg";
import params from "@/assets/params.json";
import { formatSeconds } from "@/lib/time";

import CModules from "../params/CModules";

interface CSidebarParamsProps {}

const CSidebarParams: React.FC<CSidebarParamsProps> = () => {
  return (
    <Flex direction="column" bg="gray.900" borderRight="1px" borderColor="gray.700" color="white" h="full" minW="60">
      <Flex gap="2" p="2" borderBottom="1px" borderColor="gray.700">
        <Button flex="1" size="sm" leftIcon={<RiDownload2Fill />}>
          Importar
        </Button>
        <Button flex="1" size="sm" leftIcon={<RiUpload2Fill />}>
          Exportar
        </Button>
      </Flex>
      <Flex gap="2" p="2" borderBottom="1px" borderColor="gray.700">
        <Input size="sm" placeholder="Buscar" bg="gray.800" borderRadius="4" _placeholder={{ color: "gray.400" }} />
        <IconButton aria-label="Search" icon={<RiSearch2Line />} size="sm" bg="green.500" />
      </Flex>
      <Flex dir="column" flex="1" w="full">
        <CModules modules={params.modules} />
      </Flex>
      <Flex p="2">
        <Button w="full" size="sm" bg="green.500">
          Enviar
        </Button>
      </Flex>
    </Flex>
  );
};

export default CSidebarParams;
