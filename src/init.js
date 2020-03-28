import G6 from "./g6";

const LEFTPAD_OFFSET = 320;
const HEADER_OFFSET = 120;
const RIGHT_OFFSET = 8;

const CANVAS_MIN_WIDTH = 640;
const CANVAS_MIN_HEIGHT = 480;

export default function init() {
  const mountNode = document.getElementById("mountNode");
  const canvasWidth = document.documentElement.clientWidth - LEFTPAD_OFFSET - RIGHT_OFFSET;
  const canvasHeight = document.documentElement.clientHeight - HEADER_OFFSET;

  return new G6.Graph({
    container: "mountNode",
    width: canvasWidth > CANVAS_MIN_WIDTH ? canvasWidth : CANVAS_MIN_WIDTH,
    height: canvasHeight > CANVAS_MIN_HEIGHT ? canvasHeight : CANVAS_MIN_HEIGHT,
    maxZoom: 3,
    minZoom: 0.2,
    groupType: "rect",
    modes: {
      default: ["drag-node", "click-add-edge", "drag-canvas"],
      testScheme: ["change-input-state", "drag-canvas"],
    }
  });
}