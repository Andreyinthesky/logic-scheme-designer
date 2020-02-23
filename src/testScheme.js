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

console.log("Success");

console.log("start eval");

const queue = [in1, in2];

while (queue.length > 0) {
  const current = queue.shift();
  const output = current.output;
  output && output.forEach(outputObj => {
    const output = outputObj.el;
    output.input[outputObj.inputIndex] = current.eval();
    queue.push(output);
  });
}

console.log("end eval");

console.log(out.input, out2.input);