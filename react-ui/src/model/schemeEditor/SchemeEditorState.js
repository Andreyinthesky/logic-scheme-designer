export default class SchemeEditorState {
  constructor({
    leftTopCornerPosition,
    schemeData,
    scale,
    mode,
    index
  }) {
    this.leftTopCornerPosition = leftTopCornerPosition;
    this.schemeData = schemeData;
    this.scale = scale;
    this.mode = mode;
    this.index = index;
  }
}