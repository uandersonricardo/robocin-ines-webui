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

export const drawField = (field: Field, canvasWidth: number, canvasHeight: number, ctx: CanvasRenderingContext2D) => {
  const hRatio = canvasWidth / field.length;
  const vRatio = canvasHeight / field.width;
  const ratio = Math.min(hRatio, vRatio);
  const width = field.length * ratio;
  const height = field.width * ratio;
  const centerShiftX = (canvasWidth - width) / 2;
  const centerShiftY = (canvasHeight - height) / 2;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "#056D0B";
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 2;

  ctx.fillRect(centerShiftX, centerShiftY, width, height);
  ctx.strokeRect(centerShiftX, centerShiftY, width, height);

  ctx.strokeRect(
    centerShiftX + (field.length - field.goalDepth) * ratio,
    centerShiftY + ((field.width - field.goalWidth) / 2) * ratio,
    field.goalDepth * ratio,
    field.goalWidth * ratio,
  );

  ctx.strokeRect(
    centerShiftX,
    centerShiftY + ((field.width - field.goalWidth) / 2) * ratio,
    field.goalDepth * ratio,
    field.goalWidth * ratio,
  );

  ctx.strokeRect(
    centerShiftX,
    centerShiftY + ((field.width - field.penaltyAreaWidth) / 2) * ratio,
    field.penaltyAreaDepth * ratio,
    field.penaltyAreaWidth * ratio,
  );

  ctx.strokeRect(
    centerShiftX + (field.length - field.penaltyAreaDepth) * ratio,
    centerShiftY + ((field.width - field.penaltyAreaWidth) / 2) * ratio,
    field.penaltyAreaDepth * ratio,
    field.penaltyAreaWidth * ratio,
  );

  ctx.beginPath();
  ctx.arc(
    centerShiftX + field.goalCenterToPenaltyMark * ratio,
    centerShiftY + (field.width / 2) * ratio,
    100 * ratio,
    0,
    2 * Math.PI,
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(
    centerShiftX + (field.length - field.goalCenterToPenaltyMark) * ratio,
    centerShiftY + (field.width / 2) * ratio,
    100 * ratio,
    0,
    2 * Math.PI,
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(
    centerShiftX + (field.length / 2) * ratio,
    centerShiftY + (field.width / 2) * ratio,
    (field.goalWidth * ratio) / 2,
    0,
    2 * Math.PI,
  );
  ctx.stroke();
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
