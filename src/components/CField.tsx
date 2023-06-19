import { Flex } from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";

import { InesContext } from "@/contexts/ines";

import CCanvas from "./CCanvas";

const CField: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const { field, frame } = useContext(InesContext);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
      setHeight(containerRef.current.offsetHeight);
    }
  }, [containerRef]);

  return (
    <Flex flex="1" w="full" direction="column" align="center" justify="center" bg="gray.800" ref={containerRef}>
      <CCanvas canvasWidth={width} canvasHeight={height} field={field} frame={frame} zoomAndPan={false} />
    </Flex>
  );
};

export default CField;
