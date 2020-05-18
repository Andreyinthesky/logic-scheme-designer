import G6 from "@antv/g6";

import registerBehaviors from "./behaviors";
import registerEdges from "./edges";
import registerNodes from "./nodes";

registerBehaviors(G6);
registerEdges(G6);
registerNodes(G6);

G6.registerLayout("schemeLayout", {});

export default G6;