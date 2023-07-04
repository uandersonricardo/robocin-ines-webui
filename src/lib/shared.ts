export type ScaleParams = {
  ratio: number;
  width: number;
  height: number;
  centerShiftX: number;
  centerShiftY: number;
  usableWidth: number;
  usableHeight: number;
};

export const extractScaleParams = (field: Field, canvasWidth: number, canvasHeight: number): ScaleParams => {
  const hRatio = canvasWidth / (field.length + field.boundaryWidth * 2);
  const vRatio = canvasHeight / (field.width + field.boundaryWidth * 2);
  const ratio = Math.min(hRatio, vRatio);
  const usableWidth = field.length * ratio;
  const usableHeight = field.width * ratio;
  const width = (field.length + field.boundaryWidth * 2) * ratio;
  const height = (field.width + field.boundaryWidth * 2) * ratio;
  const centerShiftX = (canvasWidth - usableWidth) / 2;
  const centerShiftY = (canvasHeight - usableHeight) / 2;

  return { ratio, width, height, centerShiftX, centerShiftY, usableWidth, usableHeight };
};

export const robotsColors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#000000"];
