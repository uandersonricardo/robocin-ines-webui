import { Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

import useInesStore from "@/stores/useInesStore";

import CCanvas from "./CCanvas";

const CField: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const { field, frame, isFetching, buffer, nextSample, isPlaying, isLive } = useInesStore((state) => ({
    field: state.field,
    frame: state.frame,
    isFetching: state.isFetching,
    buffer: state.buffer,
    nextSample: state.nextSample,
    isPlaying: state.isPlaying,
    isLive: state.isLive,
  }));

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
      setHeight(containerRef.current.offsetHeight);
    }
  }, [containerRef]);

  const isBuffering = !isLive && isFetching && buffer.length - 1 <= nextSample;

  return (
    <Flex
      flex="1"
      w="full"
      direction="column"
      align="center"
      justify="center"
      bg="gray.800"
      position="relative"
      ref={containerRef}
    >
      {isBuffering && (
        <Flex
          borderRadius="lg"
          bg="blackAlpha.600"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          p="4"
        >
          <Spinner size="md" color="white" thickness="4px" />
        </Flex>
      )}
      <CCanvas
        canvasWidth={width}
        canvasHeight={height}
        field={field}
        frame={frame}
        zoomAndPan={false}
        isPlaying={isPlaying}
      />
    </Flex>
  );
};

export default CField;
