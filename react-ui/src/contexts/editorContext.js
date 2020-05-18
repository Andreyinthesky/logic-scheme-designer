import React from "react";

export const EditorContext = React.createContext(
  {
    upScaleCallback: null,
    downScaleCallback: null,
    deleteSelectedCallback: null,
    addNodeCallback: null
  }
);