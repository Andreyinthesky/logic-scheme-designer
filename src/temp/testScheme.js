class Node {
  constructor(input, output) {
    this.input = input;
    this.output = output;
  }
}

class Input extends Node {
  constructor(input, output) {
    super(input, output)
  }

  eval() {
    return this.input[0];
  }
}

class Out extends Node {
  constructor(input, output) {
    super(input, output)
  }
}


class Or extends Node {
  constructor(input, output) {
    super(input, output)
  }

  eval() {
    return this.input[0] || this.input[1];
  }
}

class Not extends Node {
  constructor(input, output) {
    super(input, output)
  }

  eval() {
    return !this.input[0];
  }
}

const out = new Out([false]);
const out2 = new Out([false]);
const or = new Or([false, false], [{ inputIndex: 0, el: out }]);
const not = new Not([false], [{ inputIndex: 1, el: or }, { inputIndex: 0, el: out2 }]);
const in1 = new Input([true], [{ inputIndex: 0, el: or }]);
const in2 = new Input([true], [{ inputIndex: 0, el: not }]);

const elements = [out, out2, or, not, in1, in2];

function evalScheme(rankedElements) {
  console.log("start eval");
  const maxRank = rankedElements.length - 1;

  for (let rank = 0; rank <= maxRank; rank++) {
    rankedElements[rank].forEach(element => {
      const outputs = element.output;

      outputs && outputs.forEach(outputObj => {
        const output = outputObj.el;
        output.input[outputObj.inputIndex] = element.eval();
      });
    });
  }

  console.log("end eval");
}

function rankElements() {
  const queue = [in1, in2];

  elements.forEach(element => element.rank = null);
  queue.forEach(element => element.rank = 0);

  while (queue.length > 0) {
    const current = queue.shift();
    const output = current.output;

    output && output.forEach(outputObj => {
      const output = outputObj.el;

      if (output.rank < current.rank + 1) {
        output.rank = current.rank + 1;
      }

      queue.push(output);
    });
  }

  const rankedElements = [];
  elements.forEach(element => {
    const rank = element.rank;

    if (!rankedElements[rank])
      rankedElements[rank] = [];

    rankedElements[rank].push(element);
  });

  return rankedElements;
}

const rankedElements = rankElements();

evalScheme(rankedElements);

console.log(out, out2);