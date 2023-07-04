import { extractScaleParams, robotsColors, ScaleParams } from "./shared";

class MatchFrame {
  private frame: Frame;
  private field: Field;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scaleParams: ScaleParams;

  constructor(frame: Frame, ctx: CanvasRenderingContext2D) {
    this.frame = frame;
    this.field = frame.field;
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleParams = extractScaleParams(this.field, this.canvas.clientWidth, this.canvas.clientHeight);
  }

  public draw() {
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

    // Draw field
    if (this.field) {
      this.drawBackground();
      this.drawGoals();
      this.drawPenaltyAreas();
      this.drawGoalCenterToPenaltyMark();
      this.drawMiddleLine();
    }

    // Draw frame
    this.drawRobots();
    this.drawBall();
  }

  private drawBackground() {
    const { centerShiftX, centerShiftY, width, height } = this.scaleParams;

    this.ctx.fillStyle = "#056D0B";
    this.ctx.strokeStyle = "#FFFFFF";
    this.ctx.lineWidth = 3;

    this.ctx.fillRect(centerShiftX, centerShiftY, width, height);
    this.ctx.strokeRect(centerShiftX, centerShiftY, width, height);
  }

  private drawGoals() {
    const { centerShiftX, centerShiftY, ratio } = this.scaleParams;

    this.ctx.strokeRect(
      centerShiftX + (this.field.length - this.field.goalDepth) * ratio,
      centerShiftY + ((this.field.width - this.field.goalWidth) / 2) * ratio,
      this.field.goalDepth * ratio,
      this.field.goalWidth * ratio,
    );

    this.ctx.strokeRect(
      centerShiftX,
      centerShiftY + ((this.field.width - this.field.goalWidth) / 2) * ratio,
      this.field.goalDepth * ratio,
      this.field.goalWidth * ratio,
    );
  }

  private drawPenaltyAreas() {
    const { centerShiftX, centerShiftY, ratio } = this.scaleParams;

    this.ctx.strokeRect(
      centerShiftX,
      centerShiftY + ((this.field.width - this.field.penaltyAreaWidth) / 2) * ratio,
      this.field.penaltyAreaDepth * ratio,
      this.field.penaltyAreaWidth * ratio,
    );

    this.ctx.strokeRect(
      centerShiftX + (this.field.length - this.field.penaltyAreaDepth) * ratio,
      centerShiftY + ((this.field.width - this.field.penaltyAreaWidth) / 2) * ratio,
      this.field.penaltyAreaDepth * ratio,
      this.field.penaltyAreaWidth * ratio,
    );
  }

  private drawGoalCenterToPenaltyMark() {
    const { centerShiftX, centerShiftY, ratio } = this.scaleParams;

    this.ctx.beginPath();
    this.ctx.arc(
      centerShiftX + this.field.goalCenterToPenaltyMark * ratio,
      centerShiftY + (this.field.width / 2) * ratio,
      100 * ratio,
      0,
      2 * Math.PI,
    );
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(
      centerShiftX + (this.field.length - this.field.goalCenterToPenaltyMark) * ratio,
      centerShiftY + (this.field.width / 2) * ratio,
      100 * ratio,
      0,
      2 * Math.PI,
    );
    this.ctx.stroke();
  }

  private drawMiddleLine() {
    const { centerShiftX, centerShiftY, ratio } = this.scaleParams;

    this.ctx.beginPath();
    this.ctx.arc(
      centerShiftX + (this.field.length / 2) * ratio,
      centerShiftY + (this.field.width / 2) * ratio,
      (this.field.goalWidth * ratio) / 2,
      0,
      2 * Math.PI,
    );
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(centerShiftX + (this.field.length / 2) * ratio, centerShiftY);
    this.ctx.lineTo(centerShiftX + (this.field.length / 2) * ratio, centerShiftY + this.field.width * ratio);
    this.ctx.stroke();
  }

  private drawBall() {
    if (!this.frame.ball.position) {
      return;
    }

    const { centerShiftX, centerShiftY, ratio } = this.scaleParams;

    this.ctx.fillStyle = "#F68A0F";
    this.ctx.beginPath();
    this.ctx.arc(
      centerShiftX + this.frame.ball.position.x * ratio + (this.field.length / 2) * ratio,
      centerShiftY + this.frame.ball.position.y * ratio + (this.field.width / 2) * ratio,
      70 * ratio,
      0,
      2 * Math.PI,
    );
    this.ctx.fill();
  }

  private drawRobots() {
    this.frame.robots.forEach((robot) => {
      this.drawRobot(robot, robot.color === "COLOR_BLUE" ? "#0000FF" : "#FFFF00");
    });
  }

  private drawRobot(robot: Robot, color: string) {
    const { centerShiftX, centerShiftY, ratio } = this.scaleParams;

    this.ctx.save();
    this.ctx.translate(
      centerShiftX + robot.position.x * ratio + (this.field.length / 2) * ratio,
      centerShiftY + robot.position.y * ratio + (this.field.width / 2) * ratio,
    );
    this.ctx.rotate(robot.angle);

    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(-275 * ratio, -275 * ratio, 550 * ratio, 550 * ratio);

    this.ctx.fillStyle = color;
    this.ctx.fillRect(-225 * ratio, 25 * ratio, 450 * ratio, 200 * ratio);

    this.ctx.fillStyle = robotsColors[robot.id];
    this.ctx.fillRect(-225 * ratio, -225 * ratio, 450 * ratio, 200 * ratio);

    this.ctx.beginPath();
    this.ctx.arc(0, 0, 120 * ratio, 0, 2 * Math.PI);
    this.ctx.fillStyle = "#000000";
    this.ctx.fill();

    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "20px Arial";
    this.ctx.fillText(
      robot.id?.toString() || "0",
      -this.ctx.measureText(robot.id?.toString() || "0").width / 2,
      this.ctx.measureText(robot.id?.toString() || "0").actualBoundingBoxAscent / 2,
    );

    this.ctx.restore();
  }
}

export default MatchFrame;
