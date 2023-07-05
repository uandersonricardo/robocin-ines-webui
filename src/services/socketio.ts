import { io } from "socket.io-client";

import useInesStore from "@/stores/useInesStore";

let currentAnimationFrame: number | null = null;

const socketIo = io("http://localhost:3333");

socketIo.on("connect", () => {
  socketIo.send({ command: "subscribe-live" });
});

socketIo.on("message", (message) => {
  const { setMatch, pushChunk, receiveSample } = useInesStore.getState();

  if (message.type === undefined) {
    setMatch({
      id: message._id,
      duration: Date.parse(message.lastPacketReceivedAt) - Date.parse(message.firstPacketReceivedAt),
      startedAt: new Date(message.firstPacketReceivedAt),
    });
  } else if (message.type === "chunk") {
    const duration = Date.parse(message.match.lastPacketReceivedAt) - Date.parse(message.match.firstPacketReceivedAt);
    pushChunk(message.data, duration);
  } else {
    if (currentAnimationFrame) {
      window.cancelAnimationFrame(currentAnimationFrame);
    }

    currentAnimationFrame = window.requestAnimationFrame(() => {
      receiveSample(message);
      currentAnimationFrame = null;
    });
  }
});

export default socketIo;
