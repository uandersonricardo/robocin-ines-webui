type Module = {
  name: string;
  parameters: Parameter[];
};

type Parameter = {
  name: string;
  description: string;
  type: string;
  value: string;
  details: {
    [key: string]: string;
  };
};

type Timestamp = {
  seconds: string;
  nanos: number;
};

type Field = {
  id: string;
  timestamp: Timestamp;
  length: number;
  width: number;
  goalDepth: number;
  goalWidth: number;
  penaltyAreaDepth: number;
  penaltyAreaWidth: number;
  goalCenterToPenaltyMark: number;
};

type Team = {
  name: string;
  score: number;
  yellowCards: number;
  redCards: number;
  timeouts: number;
  goalkeeperId: number;
};

type Status = {
  id: string;
  timestamp: Timestamp;
  eventTimestamp: Timestamp;
  homeTeam: Team;
  awayTeam: Team;
  command: Record<string, any>;
  totalCommands: string;
};

type Point = {
  x: number;
  y: number;
};

type Ball = {
  position: Point;
  velocity: any;
};

type Robot = {
  id: number;
  position: Point;
  angle: number;
  velocity: any;
};

type Frame = {
  id: string;
  timestamp: Timestamp;
  ball: Ball;
  teammates: Robot[];
  opponents: Robot[];
};

type Match = {
  id: string;
  startedAt: Date;
  duration: number;
};

type Sample = {
  _id: string;
  matchId: string;
  type: "status" | "frame" | "field";
  data: any;
  createdAt: string;
};

type Chunk = Sample[];
