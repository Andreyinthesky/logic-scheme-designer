const createMountNode = () => {
  const mountNode = document.createElement("div");
  mountNode.style.width = "1024px";
  mountNode.style.height = "768px";
  document.body.appendChild(mountNode);

  return mountNode;
}

export default createMountNode;