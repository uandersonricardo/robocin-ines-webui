import {
  Box,
  Button,
  Flex,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  TabPanel,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { RiPlayFill, RiStopFill } from "react-icons/ri";

import socketIo from "@/services/socketio";
import useInesStore from "@/stores/useInesStore";
import { formatSeconds } from "@/utils/time";

import CField from "../components/CField";
import CSidebarStatus from "../components/CSidebarStatus";
import CSidebarParams from "../layouts/CSidebarParams";

const CLive: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTime, setTooltipTime] = useState(0);
  const {
    match,
    isPlaying,
    isLive,
    togglePlay,
    toggleLive,
    clearBuffer,
    setIsFetching,
    bufferCurrentDate,
    setBufferCurrentDate,
  } = useInesStore((state) => ({
    match: state.match,
    frame: state.frame,
    isPlaying: state.isPlaying,
    isLive: state.isLive,
    togglePlay: state.togglePlay,
    toggleLive: state.toggleLive,
    clearBuffer: state.clearBuffer,
    setIsFetching: state.setIsFetching,
    bufferCurrentDate: state.bufferCurrentDate,
    setBufferCurrentDate: state.setBufferCurrentDate,
  }));

  const current =
    bufferCurrentDate && match ? Math.round((bufferCurrentDate.getTime() - match.startedAt.getTime()) / 1000) : 0;
  const max = match ? Math.round(match.duration / 1000) : current;

  const onMouseEnter = () => {
    setShowTooltip(true);
    setTooltipTime(current);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const track = trackRef.current as HTMLDivElement;
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const time = Math.round((x / width) * max);
    setTooltipTime(time);
  };

  const onMouseLeave = () => {
    setShowTooltip(false);
  };

  const onClick = () => {
    if (isLive) {
      toggleLive();
    }

    if (isPlaying) {
      togglePlay();
    }

    const selectedDate = match ? new Date(match.startedAt.getTime() + tooltipTime * 1000) : null;
    const lastTimestamp = selectedDate?.toISOString() || null;

    clearBuffer();
    setBufferCurrentDate(selectedDate);
    setIsFetching(true);
    socketIo.send({ command: "get-chunk", lastTimestamp: lastTimestamp });
  };

  return (
    <TabPanel display="flex" flexDirection="row" p="0" flex="1">
      <CSidebarParams />
      <Flex flex="1" h="full" direction="column" align="center" justify="center" bg="gray.800">
        <Flex flex="1" w="full">
          <CField />
          <CSidebarStatus />
        </Flex>
        <Flex direction="column" w="full">
          <Slider aria-label="slider-ex-1" value={current} max={max}>
            <Tooltip label={formatSeconds(tooltipTime)} isOpen={showTooltip} placement="top">
              <SliderTrack
                bg="gray.800"
                ref={trackRef}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseMove={onMouseMove}
                onClick={onClick}
              >
                <SliderFilledTrack bg="red.500" />
              </SliderTrack>
            </Tooltip>
            <SliderThumb />
          </Slider>
          <Flex direction="row" gap="3" py="2" px="3" bg="gray.900" w="full" align="center">
            <IconButton
              aria-label="Play/stop"
              icon={isPlaying ? <RiStopFill /> : <RiPlayFill />}
              colorScheme="transparent"
              color="white"
              fontSize="xl"
              onClick={togglePlay}
              size="xs"
              cursor="pointer"
            />
            <Button variant="ghost" display="flex" alignItems="center" size="xs" gap="2" onClick={toggleLive}>
              <Box as="span" bg={isLive ? "red.500" : "gray.500"} w="2" h="2" borderRadius="full" />
              Live
            </Button>
            <Text color="white">{current ? formatSeconds(current) : "00:00:00"}</Text>
          </Flex>
        </Flex>
      </Flex>
    </TabPanel>
  );
};

export default CLive;
