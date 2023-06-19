import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Text,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { RiArrowDownSLine, RiRobotFill, RiTimeFill } from "react-icons/ri";

import { InesContext } from "@/contexts/ines";

const CSidebarStatus: React.FC = () => {
  const { status } = useContext(InesContext);

  return (
    <Flex direction="column" bg="gray.900" borderLeft="1px" borderColor="gray.700" color="white" h="full" minW="60">
      <Flex gap="2" p="2" borderBottom="1px" borderColor="gray.700">
        <Flex flex="1" direction="column" align="center" gap="1">
          <Text fontSize="xs" fontWeight="bold" color="white">
            {status?.homeTeam.name || "Home"}
          </Text>
          <Avatar size="lg" name={status?.homeTeam.name || "Home"} />
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
                {status?.homeTeam.yellowCards}
              </Text>
            </Flex>
            <Flex direction="column" align="center" justify="center" gap="1">
              <Box w="2" h="3" bg="red.500" borderRadius="1" />
              <Text fontSize="xs" fontWeight="bold">
                {status?.homeTeam.redCards}
              </Text>
            </Flex>
            <Flex direction="column" align="center" justify="center" gap="1">
              <Icon as={RiTimeFill} fontSize="xs" color="gray.400" />
              <Text fontSize="xs" fontWeight="bold">
                {status?.homeTeam.timeouts}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex flex="1" direction="column" justify="center" align="center">
          <Text fontSize="xs" color="gray.400">
            {"1st Half"}
          </Text>
          <Text fontSize="4xl" lineHeight="1" fontWeight="bold">
            {status?.homeTeam.score || 0}:{status?.awayTeam.score || 0}
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
            {status?.awayTeam.name || "Away"}
          </Text>
          <Avatar size="lg" name={status?.awayTeam.name || "Away"} />
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
                {status?.awayTeam.yellowCards}
              </Text>
            </Flex>
            <Flex direction="column" align="center" justify="center" gap="1">
              <Box w="2" h="3" bg="red.500" borderRadius="1" />
              <Text fontSize="xs" fontWeight="bold">
                {status?.awayTeam.redCards}
              </Text>
            </Flex>
            <Flex direction="column" align="center" justify="center" gap="1">
              <Icon as={RiTimeFill} fontSize="xs" color="gray.400" />
              <Text fontSize="xs" fontWeight="bold">
                {status?.awayTeam.timeouts}
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
