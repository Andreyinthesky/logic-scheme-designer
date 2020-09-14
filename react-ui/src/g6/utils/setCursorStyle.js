export default function setCursorStyle(style) {
  const container = this.graph.get("container");
  for (var i = 0; i < container.children.length; i++) {
    if (container.children[i].tagName === "CANVAS") {
      container.children[i].style.cursor = style;
      return;
    }
  }
}