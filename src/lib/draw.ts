type Robot = {
  id: string;
  x: number;
  y: number;
  w: number;
};

type Ball = {
  x: number;
  y: number;
};

export type Frame = {
  allies: Robot[];
  enemies: Robot[];
  ball: Ball;
  currentTimestamp: number;
  firstTimestamp: number;
};

export const drawFrame = (frame: Frame, ctx: CanvasRenderingContext2D) => {
  ctx.canvas.width = ctx.canvas.clientWidth;
  ctx.canvas.height = ctx.canvas.clientHeight;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawBall(frame.ball, ctx);

  for (const robot of frame.allies) {
    drawRobot(robot, ctx, "blue");
  }

  for (const robot of frame.enemies) {
    drawRobot(robot, ctx, "red");
  }
};

const drawBall = (ball: Ball, ctx: CanvasRenderingContext2D) => {
  const x = (ball.x / 1000) * ctx.canvas.width;
  const y = (ball.y / 1000) * ctx.canvas.height;

  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
};

const drawRobot = (robot: Robot, ctx: CanvasRenderingContext2D, color: string) => {
  const x = (robot.x / 1000) * ctx.canvas.width;
  const y = (robot.y / 1000) * ctx.canvas.height;

  ctx.beginPath();
  ctx.arc(x, y, 15, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
};
