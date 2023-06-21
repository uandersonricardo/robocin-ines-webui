import React, { createContext, ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";

import { convertTimestampToDate } from "@/utils/time";

export interface InesContextProps {
  field: Field | null;
  setField: React.Dispatch<React.SetStateAction<Field | null>>;
  status: Status | null;
  setStatus: React.Dispatch<React.SetStateAction<Status | null>>;
  frame: Frame | null;
  setFrame: React.Dispatch<React.SetStateAction<Frame | null>>;
  match: Match | null;
  setMatch: React.Dispatch<React.SetStateAction<Match | null>>;
  buffer: Chunk;
  setBuffer: React.Dispatch<React.SetStateAction<Chunk>>;
  isPlaying: boolean;
  togglePlay: () => void;
  isLive: boolean;
  toggleLive: () => void;
}

export const InesContext = createContext<InesContextProps>({} as InesContextProps);

const fieldDefault: Field = {
  id: "340",
  timestamp: { seconds: "1685230447", nanos: 356585870 },
  length: 9000,
  width: 6000,
  goalDepth: 180,
  goalWidth: 1000,
  penaltyAreaDepth: 1000,
  penaltyAreaWidth: 2000,
  goalCenterToPenaltyMark: 6000,
};

const statusDefault: Status = {
  id: "78194",
  timestamp: { seconds: "1685224289", nanos: 450631402 },
  eventTimestamp: { seconds: "1685224289", nanos: 416736667 },
  homeTeam: {
    name: "Home",
    score: 3,
    yellowCards: 4,
    redCards: 7,
    timeouts: 4,
    goalkeeperId: 4,
  },
  awayTeam: {
    name: "Away",
    score: 5,
    yellowCards: 1,
    redCards: 1,
    timeouts: 6,
    goalkeeperId: 3,
  },
  command: { awayPrepareDirectFreeKick: {} },
  totalCommands: "78194",
};

const frameDefault: Frame = {
  id: "51941",
  timestamp: { seconds: "1685230497", nanos: 586992841 },
  ball: {
    position: { x: 739.41162109375, y: 577.985595703125 },
    velocity: {},
  },
  teammates: [
    {
      id: 0,
      position: { x: -379.94775390625, y: 2329.96826171875 },
      angle: 0.14654088020324707,
      velocity: {},
    },
    {
      id: 1,
      position: { x: 3396.458984375, y: 1777.26220703125 },
      angle: -0.9127233028411865,
      velocity: {},
    },
    {
      id: 2,
      position: { x: 2325.115234375, y: 1009.333740234375 },
      angle: -0.6630275249481201,
      velocity: {},
    },
    {
      id: 3,
      position: { x: 2917.86572265625, y: 1244.2578125 },
      angle: 1.8898046016693115,
      velocity: {},
    },
    {
      id: 4,
      position: { x: 519.9052734375, y: -1570.924560546875 },
      angle: 1.4593055248260498,
      velocity: {},
    },
    {
      id: 5,
      position: { x: -49.9052734375, y: 2537.5390625 },
      angle: -1.381974220275879,
      velocity: {},
    },
  ],
  opponents: [
    {
      id: 0,
      position: { x: -2437.054443359375, y: -739.777587890625 },
      angle: -2.177166223526001,
      velocity: {},
    },
    {
      id: 1,
      position: { x: -2820.148193359375, y: 2489.7177734375 },
      angle: 1.7385351657867432,
      velocity: {},
    },
    {
      id: 2,
      position: { x: -1618.7919921875, y: -1680.46826171875 },
      angle: 2.741132974624634,
      velocity: {},
    },
    {
      id: 3,
      position: { x: -1847.983642578125, y: -311.767822265625 },
      angle: 0.6097686290740967,
      velocity: {},
    },
    {
      id: 4,
      position: { x: 802.8017578125, y: -759.547119140625 },
      angle: 2.5677597522735596,
      velocity: {},
    },
    {
      id: 5,
      position: { x: 676.626953125, y: -1743.532470703125 },
      angle: 0.13201379776000977,
      velocity: {},
    },
  ],
};

const PREFETCH_FREQUENCY = 500;
const BUFFER_SIZE = 2000;

interface InesProviderProps {
  children?: ReactNode;
}

export const InesProvider: React.FC<InesProviderProps> = ({ children }) => {
  const [socketUrl, setSocketUrl] = useState<string | null>("ws://localhost:3333");
  const [field, setField] = useState<Field | null>(fieldDefault);
  const [status, setStatus] = useState<Status | null>(statusDefault);
  const [frame, setFrame] = useState<Frame | null>(frameDefault);
  const [match, setMatch] = useState<Match | null>(null);
  const [buffer, setBuffer] = useState<Chunk>([]);
  const [nextSample, setNextSample] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLive, setIsLive] = useState(false);
  const lastTimestamp = useRef(Date.now());

  const onMessage = (e: MessageEvent) => {
    const message = JSON.parse(e.data);

    if (message.type === undefined) {
      setMatch({
        id: message._id,
        duration: Date.parse(message.lastPacketReceivedAt) - Date.parse(message.firstPacketReceivedAt),
        startedAt: new Date(message.firstPacketReceivedAt),
      });
    } else if (message.type === "chunk") {
      if (buffer.length + message.data.length > BUFFER_SIZE) {
        setNextSample((nextSample) => nextSample - (buffer.length + message.data.length - BUFFER_SIZE));
      }

      setBuffer((buffer) => [...buffer, ...message.data].slice(-BUFFER_SIZE));
    }
  };

  const { sendJsonMessage } = useWebSocket<Frame | null>(socketUrl, {
    shouldReconnect: () => true,
    onMessage,
  });

  const togglePlay = () => {
    lastTimestamp.current = Date.now();
    setIsPlaying((isPlaying) => !isPlaying);
  };

  const toggleLive = () => {
    setIsLive((isLive) => !isLive);
  };

  useEffect(() => {
    if (!isLive) {
      setBuffer([]);
      sendJsonMessage({
        command: "get-chunk",
        lastTimestamp: null,
      });
    }
  }, [isLive]);

  useLayoutEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (nextSample % PREFETCH_FREQUENCY === 0) {
      const lastTimestamp = buffer.length ? buffer[buffer.length - 1].createdAt : null;
      sendJsonMessage({
        command: "get-chunk",
        lastTimestamp: lastTimestamp,
      });
    }

    if (nextSample < buffer.length - 1) {
      const sample = buffer[nextSample];
      if (sample.type === "frame") {
        setFrame(sample.data);
      } else if (sample.type === "status") {
        setStatus(sample.data);
      } else if (sample.type === "field") {
        setField(sample.data);
      }

      window.requestAnimationFrame(() => {
        const now = Date.now();
        const elapsed = now - lastTimestamp.current;

        let offset = 1;
        while (nextSample + offset < buffer.length) {
          const possibleNextSample = buffer[nextSample + offset];
          const sampleElapsed =
            convertTimestampToDate(possibleNextSample.data.timestamp).getTime() -
            convertTimestampToDate(sample.data.timestamp).getTime();
          if (sampleElapsed < elapsed) {
            offset++;
          } else {
            break;
          }
        }

        lastTimestamp.current = now;
        setNextSample((nextSample) => nextSample + offset);
      });
    } else {
      setIsPlaying(false);
    }
  }, [nextSample, isPlaying]);

  return (
    <InesContext.Provider
      value={{
        field,
        setField,
        status,
        setStatus,
        frame,
        setFrame,
        match,
        setMatch,
        buffer,
        setBuffer,
        isPlaying,
        togglePlay,
        isLive,
        toggleLive,
      }}
    >
      {children}
    </InesContext.Provider>
  );
};
