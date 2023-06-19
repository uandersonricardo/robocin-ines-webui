import { Button, Flex, IconButton, Image, Kbd, Tab, TabList, Text } from "@chakra-ui/react";
import React from "react";
import { RiBarChart2Fill, RiKeyboardBoxFill, RiSettings4Fill } from "react-icons/ri";

import logo from "@/assets/robocin.png";

const CHeader: React.FC = () => {
  return (
    <Flex align="center" p="1" bg="gray.900" borderBottom="1px" borderColor="gray.700">
      <Flex align="center" flex="1">
        <Image src={logo} alt="logo" h="6" />
        <Text color="white" mx="2" fontWeight="medium">
          |
        </Text>
        <Text color="white" fontWeight="medium">
          INES
        </Text>
      </Flex>
      <TabList>
        <Tab fontSize="xs" _selected={{ color: "white", bg: "green.500" }} borderRadius="4" color="gray.500">
          Live
        </Tab>
        <Tab fontSize="xs" _selected={{ color: "white", bg: "green.500" }} borderRadius="4" color="gray.500">
          Draw
        </Tab>
        <Tab fontSize="xs" _selected={{ color: "white", bg: "green.500" }} borderRadius="4" color="gray.500">
          Interact
        </Tab>
        <Tab fontSize="xs" _selected={{ color: "white", bg: "green.500" }} borderRadius="4" color="gray.500">
          Details
        </Tab>
      </TabList>
      <Flex align="center" gap="2" flex="1" justifyContent="flex-end">
        <Button leftIcon={<RiBarChart2Fill />} size="xs" variant="ghost">
          Charts
        </Button>
        <Flex align="center" gap="1">
          <Button leftIcon={<RiKeyboardBoxFill />} size="xs" variant="ghost">
            Shortcuts
          </Button>
          <Kbd borderRadius="2">CTRL</Kbd>
          <Kbd borderRadius="2">/</Kbd>
        </Flex>
        <IconButton aria-label="Settings" icon={<RiSettings4Fill />} size="xs" variant="ghost" />
      </Flex>
    </Flex>
  );
};

export default CHeader;
