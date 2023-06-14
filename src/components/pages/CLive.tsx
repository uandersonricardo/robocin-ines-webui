import {
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

import field from "@/assets/field.jpg";
import params from "@/assets/params.json";
import { formatSeconds } from "@/lib/time";

import CSidebarParams from "../layout/CSidebarParams";
import CModules from "../params/CModules";

interface CLiveProps {
  lastJsonMessage: any;
}

const CLive: React.FC<CLiveProps> = ({ lastJsonMessage }) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTime, setTooltipTime] = useState(0);

  const current = lastJsonMessage
    ? Math.round((lastJsonMessage.currentTimestamp - lastJsonMessage.firstTimestamp) / 1000)
    : 0;
  const max = lastJsonMessage
    ? Math.round((lastJsonMessage.currentTimestamp - lastJsonMessage.firstTimestamp) / 1000)
    : current;

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

  return (
    <TabPanel display="flex" flexDirection="row" p="0" flex="1">
      <CSidebarParams />
      <Flex flex="1" h="full" direction="column" align="center" justify="center" bg="gray.800">
        <canvas
          id="canvas"
          style={{ backgroundImage: `url(${field})`, backgroundSize: "100% 100%", flex: "1", aspectRatio: 6 / 9 }}
        >
          Your browser does not support the canvas element.
        </canvas>
        <Flex hidden direction="row" gap="3" py="2" px="3" bg="blackAlpha.300" w="full" align="center">
          <IconButton
            aria-label="Play/stop"
            icon={playing ? RiPlayFill : RiStopFill}
            colorScheme="transparent"
            color="white"
            onClick={() => setPlaying(!playing)}
            size="xs"
            cursor="pointer"
          />
          <Slider aria-label="slider-ex-1" value={current} max={max}>
            <Tooltip label={formatSeconds(tooltipTime)} isOpen={showTooltip} placement="top">
              <SliderTrack
                bg="gray.800"
                ref={trackRef}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseMove={onMouseMove}
              >
                <SliderFilledTrack bg="red.500" />
              </SliderTrack>
            </Tooltip>
            <SliderThumb />
          </Slider>
          <Text color="white">{current ? formatSeconds(current) : "00:00:00"}</Text>
        </Flex>
      </Flex>
    </TabPanel>
  );
};

export default CLive;
