import { WebSocketLike } from "react-use-websocket/dist/lib/types";
import { create } from "zustand";

import socketIo from "@/services/socketio";
import { convertTimestampToDate } from "@/utils/time";

const refereeDefault: Referee = {
  packetTimestamp: "1688418444652110",
  stage: "NORMAL_FIRST_HALF",
  stageTimeLeft: -168598893,
  command: "DIRECT_FREE_YELLOW",
  commandCounter: 35,
  commandTimestamp: "1688418378669568",
  yellow: {
    name: "Unknown",
    score: 0,
    redCards: 0,
    yellowCards: 0,
    timeouts: 4,
    timeoutTime: 300000000,
    goalkeeper: 0,
    foulCounter: 0,
    ballPlacementFailures: 1,
    canPlaceBall: true,
    maxAllowedBots: 11,
    botSubstitutionIntent: false,
    ballPlacementFailuresReached: false,
  },
  blue: {
    name: "Unknown",
    score: 0,
    redCards: 0,
    yellowCards: 0,
    timeouts: 4,
    timeoutTime: 300000000,
    goalkeeper: 0,
    foulCounter: 0,
    ballPlacementFailures: 2,
    canPlaceBall: true,
    maxAllowedBots: 11,
    botSubstitutionIntent: false,
    ballPlacementFailuresReached: false,
  },
  blueTeamOnPositiveHalf: false,
  currentActionTimeRemaining: -61005317,
};

const frameDefault: Frame = {
  serialId: "10627",
  timestamp: { seconds: "1688418369", nanos: 294762142 },
  ball: { position: { x: -4296.9990234375, y: -2002.876220703125 } },
  robots: [
    {
      color: "COLOR_YELLOW",
      id: 0,
      position: { x: 4383.46875, y: -480.4874572753906 },
      angle: -2.9563443660736084,
    },
    {
      color: "COLOR_YELLOW",
      id: 1,
      position: { x: 3502.136474609375, y: 276.7312316894531 },
      angle: -3.1486153602600098,
    },
    {
      color: "COLOR_YELLOW",
      id: 2,
      position: { x: 3503.28369140625, y: 74.65524291992188 },
      angle: -3.1445209980010986,
    },
    {
      color: "COLOR_YELLOW",
      id: 3,
      position: { x: -4168.1669921875, y: -1231.083740234375 },
      angle: -1.9438886642456055,
    },
    {
      color: "COLOR_YELLOW",
      id: 4,
      position: { x: 3506.04541015625, y: -325.93011474609375 },
      angle: -3.128216505050659,
    },
    {
      color: "COLOR_YELLOW",
      id: 5,
      position: { x: 3496.387451171875, y: -125.30268859863281 },
      angle: -3.1513712406158447,
    },
    {
      color: "COLOR_BLUE",
      id: 0,
      position: { x: -4389.2998046875, y: -473.5303955078125 },
      angle: -1.3025133609771729,
    },
    {
      color: "COLOR_BLUE",
      id: 1,
      position: { x: 4403.2939453125, y: -2713.709228515625 },
      angle: 0.009040290489792824,
    },
    {
      color: "COLOR_BLUE",
      id: 2,
      position: { x: 4051.005859375, y: -2768.968017578125 },
      angle: -0.013796268962323666,
    },
    {
      color: "COLOR_BLUE",
      id: 3,
      position: { x: 3649.112060546875, y: -2779.2060546875 },
      angle: 0.0011148236226290464,
    },
    {
      color: "COLOR_BLUE",
      id: 4,
      position: { x: 3754.6767578125, y: 2444.726806640625 },
      angle: -0.009620285592973232,
    },
    {
      color: "COLOR_BLUE",
      id: 5,
      position: { x: 4119.0224609375, y: 2373.950439453125 },
      angle: 0.008717612363398075,
    },
  ],
  field: {
    serialId: "10627",
    length: 9000,
    width: 6000,
    goalDepth: 180,
    goalWidth: 1000,
    penaltyAreaDepth: 1000,
    penaltyAreaWidth: 2000,
    boundaryWidth: 300,
    goalCenterToPenaltyMark: 6000,
  },
};

const BUFFER_SIZE = 10000;
const PREFETCH_FREQUENCY = 8000;

let lastTimestamp = Date.now();

type State = {
  webSocket: WebSocketLike | null;
  referee: Referee | null;
  frame: Frame | null;
  match: Match | null;
  buffer: Chunk;
  nextSample: number;
  isPlaying: boolean;
  isLive: boolean;
  isFetching: boolean;
  bufferCurrentDate: Date | null;
  setWebSocket: (webSocket: WebSocketLike | null) => void;
  setReferee: (referee: Referee) => void;
  setFrame: (frame: Frame) => void;
  setMatch: (match: Match) => void;
  clearBuffer: () => void;
  togglePlay: () => void;
  toggleLive: () => void;
  stepBuffer: () => void;
  pushChunk: (chunk: Chunk, duration: number) => void;
  setIsFetching: (isFetching: boolean) => void;
  setBufferCurrentDate: (bufferCurrentDate: Date | null) => void;
  receiveSample: (sample: Sample) => void;
};

const useInesStore = create<State>((set, get) => ({
  webSocket: null,
  referee: refereeDefault,
  frame: frameDefault,
  match: null,
  buffer: [],
  nextSample: 0,
  isPlaying: false,
  isLive: true,
  isFetching: false,
  bufferCurrentDate: null,
  setWebSocket: (webSocket: WebSocketLike | null) => set({ webSocket }),
  setReferee: (referee: Referee) => set({ referee }),
  setFrame: (frame: Frame) => set({ frame }),
  setMatch: (match: Match) => set({ match }),
  clearBuffer: () => set({ buffer: [], nextSample: 0 }),
  togglePlay: () => {
    const { isPlaying, isLive, stepBuffer, isFetching, buffer, nextSample } = get();

    lastTimestamp = Date.now();
    set({ isPlaying: !isPlaying });

    if (!isPlaying && !isLive) {
      if (!isFetching && buffer.length - nextSample <= PREFETCH_FREQUENCY) {
        set({ isFetching: true });

        const lastTimestamp = buffer.length ? buffer[buffer.length - 1].createdAt : null;
        socketIo.send({ command: "get-chunk", lastTimestamp });
      } else {
        stepBuffer();
      }
    }
  },
  toggleLive: () => {
    const { isLive, isPlaying, bufferCurrentDate } = get();
    socketIo.send({ command: isLive ? "unsubscribe-live" : "subscribe-live" });

    set({
      isPlaying: !isLive || isPlaying,
      isLive: !isLive,
      bufferCurrentDate: isLive ? null : bufferCurrentDate,
    });
  },
  setIsFetching: (isFetching: boolean) => set({ isFetching }),
  stepBuffer: () => {
    const { buffer, nextSample, isFetching, stepBuffer, isLive, isPlaying } = get();

    if (isLive || !isPlaying) {
      return;
    }

    if (nextSample < buffer.length - 1) {
      const stateChanges: Partial<State> = {};

      const sample = buffer[nextSample];
      stateChanges[sample.type] = sample.data;

      window.requestAnimationFrame(() => {
        const now = Date.now();
        const elapsed = now - lastTimestamp;

        let offset = 1;
        while (nextSample + offset < buffer.length - 1) {
          const possibleNextSample = buffer[nextSample + offset];
          const sampleElapsed =
            convertTimestampToDate(possibleNextSample.data.timestamp).getTime() -
            convertTimestampToDate(sample.data.timestamp).getTime();

          if (sampleElapsed >= elapsed) {
            break;
          }

          offset++;
        }

        const bufferCurrentDate = sample.data.timestamp
          ? convertTimestampToDate(sample.data.timestamp)
          : new Date(sample.createdAt);

        lastTimestamp = now;

        set((state) => {
          if (!state.isFetching && state.buffer.length - state.nextSample <= PREFETCH_FREQUENCY) {
            stateChanges.isFetching = true;

            const lastTimestamp = state.buffer.length ? state.buffer[state.buffer.length - 1].createdAt : null;
            socketIo.send({ command: "get-chunk", lastTimestamp });
          }

          return {
            ...stateChanges,
            nextSample: state.nextSample + offset,
            bufferCurrentDate: bufferCurrentDate,
          };
        });

        stepBuffer();
      });
    } else if (!isFetching) {
      set({ isPlaying: false });
    }
  },
  pushChunk: (chunk: Chunk, duration: number) => {
    set((state) => {
      let truncatedSamples = 0;

      if (state.buffer.length + chunk.length > BUFFER_SIZE) {
        truncatedSamples = state.buffer.length + chunk.length - BUFFER_SIZE;
      }

      return {
        buffer: [...state.buffer, ...chunk].slice(-BUFFER_SIZE),
        nextSample: state.nextSample - truncatedSamples,
        isFetching: false,
        match: state.match && {
          ...state.match,
          duration: duration,
        },
      };
    });

    const { stepBuffer, isPlaying, isLive } = get();

    if (isPlaying && !isLive) {
      stepBuffer();
    }
  },
  setBufferCurrentDate: (bufferCurrentDate: Date | null) => set({ bufferCurrentDate }),
  receiveSample: (sample: Sample) => {
    const { isPlaying } = get();
    const stateChanges: Partial<State> = {};

    if (isPlaying) {
      stateChanges[sample.type] = sample.data;
    }

    let bufferCurrentDate: Date | null = null;

    if (sample.type === "frame") {
      bufferCurrentDate = convertTimestampToDate(sample.data.timestamp);
    }

    set((state) => ({
      ...stateChanges,
      bufferCurrentDate: bufferCurrentDate || state.bufferCurrentDate,
      match: bufferCurrentDate &&
        state.match && {
          ...state.match,
          duration: bufferCurrentDate.getTime() - state.match.startedAt.getTime(),
        },
    }));
  },
}));

export default useInesStore;
