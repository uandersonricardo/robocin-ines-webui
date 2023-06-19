export type ScaleParams = {
  ratio: number;
  width: number;
  height: number;
  centerShiftX: number;
  centerShiftY: number;
};

export const extractScaleParams = (field: Field, canvasWidth: number, canvasHeight: number): ScaleParams => {
  const hRatio = canvasWidth / field.length;
  const vRatio = canvasHeight / field.width;
  const ratio = Math.min(hRatio, vRatio);
  const width = field.length * ratio;
  const height = field.width * ratio;
  const centerShiftX = (canvasWidth - width) / 2;
  const centerShiftY = (canvasHeight - height) / 2;

  return { ratio, width, height, centerShiftX, centerShiftY };
};

export const robotsColors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#000000"];
