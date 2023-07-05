import { Avatar, Badge, Box, Button, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import React from "react";
import { RiArrowDownSLine, RiRobotFill, RiTimeFill } from "react-icons/ri";

import useInesStore from "@/stores/useInesStore";

const CSidebarStatus: React.FC = () => {
  const { referee } = useInesStore((state) => ({ referee: state.referee }));

  return (
    <Flex direction="column" bg="gray.900" borderLeft="1px" borderColor="gray.700" color="white" h="full" minW="60">
      <Flex gap="2" p="2" borderBottom="1px" borderColor="gray.700">
        <Flex flex="1" direction="column" align="center" gap="1">
          <Text fontSize="xs" fontWeight="bold" color="white">
            {referee?.blue.name || "Home"}
          </Text>
          <Avatar size="lg" name={referee?.blue.name || "Home"} />
          <Flex direction="row" pt="1" align="center" justify="space-between" w="full">
            <Flex direction="column" align="center" justify="center" gap="1">
              <Icon as={RiRobotFill} fontSize="xs" color="gray.400" />
              <Text fontSize="xs" fontWeight="bold">
                {6}
              </Text>
            </Flex>
            <Flex direction="column" align="center" justify="center" gap="1">
              <Box w="2" h="3" bg="yellow.300" borderRadius="1" />
              <Text fontSize="xs" fontWeight="bold">
                {referee?.blue.yellowCards}
              </Text>
            </Flex>
            <Flex direction="column" align="center" justify="center" gap="1">
              <Box w="2" h="3" bg="red.500" borderRadius="1" />
              <Text fontSize="xs" fontWeight="bold">
                {referee?.blue.redCards}
              </Text>
            </Flex>
            <Flex direction="column" align="center" justify="center" gap="1">
              <Icon as={RiTimeFill} fontSize="xs" color="gray.400" />
              <Text fontSize="xs" fontWeight="bold">
                {referee?.blue.timeouts}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex flex="1" direction="column" justify="center" align="center">
          <Text fontSize="xs" color="gray.400">
            {"1st Half"}
          </Text>
          <Text fontSize="4xl" lineHeight="1" fontWeight="bold">
            {referee?.blue.score || 0}:{referee?.yellow.score || 0}
          </Text>
          <Text fontSize="xs" color="gray.400">
            {"04:17"}
          </Text>
          <Badge fontSize="xs" color="gray.400" mt="3">
            Force Start
          </Badge>
        </Flex>
        <Flex flex="1" direction="column" align="center" gap="1">
          <Text fontSize="xs" fontWeight="bold" color="white">
            {referee?.yellow.name || "Away"}
          </Text>
          <Avatar size="lg" name={referee?.yellow.name || "Away"} />
          <Flex direction="row" pt="1" align="center" justify="space-between" w="full">
            <Flex direction="column" align="center" justify="center" gap="1">
              <Icon as={RiRobotFill} fontSize="xs" color="gray.400" />
              <Text fontSize="xs" fontWeight="bold">
                {6}
              </Text>
            </Flex>
            <Flex direction="column" align="center" justify="center" gap="1">
              <Box w="2" h="3" bg="yellow.300" borderRadius="1" />
              <Text fontSize="xs" fontWeight="bold">
                {referee?.yellow.yellowCards}
              </Text>
            </Flex>
            <Flex direction="column" align="center" justify="center" gap="1">
              <Box w="2" h="3" bg="red.500" borderRadius="1" />
              <Text fontSize="xs" fontWeight="bold">
                {referee?.yellow.redCards}
              </Text>
            </Flex>
            <Flex direction="column" align="center" justify="center" gap="1">
              <Icon as={RiTimeFill} fontSize="xs" color="gray.400" />
              <Text fontSize="xs" fontWeight="bold">
                {referee?.yellow.timeouts}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex gap="2" p="2" justify="space-between" align="center">
        <Text fontSize="xs" fontWeight="bold" color="gray.400">
          Events
        </Text>
        <Menu>
          <MenuButton as={Button} size="xs" rightIcon={<RiArrowDownSLine />}>
            Filter
          </MenuButton>
          <MenuList>
            <MenuItem>Goal</MenuItem>
            <MenuItem>Foul</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Flex dir="column" flex="1" w="full"></Flex>
    </Flex>
  );
};

export default CSidebarStatus;
