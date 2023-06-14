import { TabPanels, Tabs } from "@chakra-ui/react";
import React, { useState } from "react";
import useWebSocket from "react-use-websocket";

import CHeader from "@/components/layout/CHeader";
import CLive from "@/components/pages/CLive";
import { drawFrame, Frame } from "@/lib/draw";

const onOpen = () => console.log("Connection opened");

const shouldReconnect = () => true;

const onMessage = (e: MessageEvent) => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const frame = JSON.parse(e.data);
  // console.log(frame);
  window.requestAnimationFrame(() => drawFrame(frame, ctx));
};

const App: React.FC = () => {
  const [port, setPort] = useState(3333);

  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const { readyState, lastJsonMessage } = useWebSocket<Frame | null>(socketUrl, {
    onOpen,
    shouldReconnect,
    onMessage,
  });

  return (
    <Tabs
      isLazy
      variant="soft-rounded"
      colorScheme="green"
      display="flex"
      size="sm"
      h="100vh"
      w="100vw"
      flexDirection="column"
      bg="gray.800"
      overflow="hidden"
    >
      <CHeader />
      <TabPanels flex="1" display="flex" flexDirection="column">
        <CLive lastJsonMessage={lastJsonMessage} />
      </TabPanels>
    </Tabs>
  );
};

export default App;
