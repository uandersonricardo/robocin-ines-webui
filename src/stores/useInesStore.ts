import { WebSocketLike } from "react-use-websocket/dist/lib/types";
import { create } from "zustand";

import socketIo from "@/services/socketio";
import { convertTimestampToDate } from "@/utils/time";

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

const BUFFER_SIZE = 10000;
const PREFETCH_FREQUENCY = 8000;

let lastTimestamp = Date.now();

type State = {
  webSocket: WebSocketLike | null;
  field: Field | null;
  status: Status | null;
  frame: Frame | null;
  match: Match | null;
  buffer: Chunk;
  nextSample: number;
  isPlaying: boolean;
  isLive: boolean;
  isFetching: boolean;
  bufferCurrentDate: Date | null;
  setWebSocket: (webSocket: WebSocketLike | null) => void;
  setField: (field: Field) => void;
  setStatus: (status: Status) => void;
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
  field: fieldDefault,
  status: statusDefault,
  frame: frameDefault,
  match: null,
  buffer: [],
  nextSample: 0,
  isPlaying: false,
  isLive: true,
  isFetching: false,
  bufferCurrentDate: null,
  setWebSocket: (webSocket: WebSocketLike | null) => set({ webSocket }),
  setField: (field: Field) => set({ field }),
  setStatus: (status: Status) => set({ status }),
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

    const bufferCurrentDate = sample.data.timestamp
      ? convertTimestampToDate(sample.data.timestamp)
      : new Date(sample.createdAt);

    set((state) => ({
      ...stateChanges,
      bufferCurrentDate,
      match: state.match && {
        ...state.match,
        duration: bufferCurrentDate.getTime() - state.match.startedAt.getTime(),
      },
    }));
  },
}));

export default useInesStore;
