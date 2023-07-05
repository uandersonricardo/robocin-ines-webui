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
  serialId: string;
  length: number;
  width: number;
  goalDepth: number;
  goalWidth: number;
  penaltyAreaDepth: number;
  penaltyAreaWidth: number;
  boundaryWidth: number;
  goalCenterToPenaltyMark: number;
};

type Team = {
  name: string;
  score: number;
  yellowCards: number;
  redCards: number;
  timeouts: number;
  timeoutTime: number;
  goalkeeper: number;
  foulCounter: number;
  ballPlacementFailures: number;
  canPlaceBall: boolean;
  maxAllowedBots: number;
  botSubstitutionIntent: boolean;
  ballPlacementFailuresReached: boolean;
};

type Referee = {
  packetTimestamp: string;
  stage: string;
  stageTimeLeft: number;
  command: string;
  commandCounter: number;
  commandTimestamp: string;
  yellow: Team;
  blue: Team;
  blueTeamOnPositiveHalf: boolean;
  currentActionTimeRemaining: number;
};

type Point = {
  x: number;
  y: number;
};

type Ball = {
  position: Point;
};

type Robot = {
  id: number;
  position: Point;
  angle: number;
  color: "COLOR_BLUE" | "COLOR_YELLOW";
};

type Frame = {
  serialId: string;
  timestamp: Timestamp;
  ball: Ball;
  robots: Robot[];
  field: Field;
};

type Match = {
  id: string;
  startedAt: Date;
  duration: number;
};

type Sample = {
  _id: string;
  matchId: string;
  type: "referee" | "frame";
  data: any;
  createdAt: string;
};

type Chunk = Sample[];
