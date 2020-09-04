import LinkedStack from "../infrastracture/LinkedStack";

describe("LinkedStack", () => {
  describe("removeAt(index)", ()=> {
    test("remove first item", () => {
      const stack = new LinkedStack(1, 2, 3);

      stack.removeAt(0);

      expect(stack.length).toBe(2);
      expect(stack._head.value).toBe(2);
      expect(stack._tail.value).toBe(3);
      expect(stack.toArray()).toEqual(expect.arrayContaining([2, 3]))
    })

    test("remove last item", () => {
      const stack = new LinkedStack(1, 2, 3);

      stack.removeAt(2);

      expect(stack.length).toBe(2);
      expect(stack._head.value).toBe(1);
      expect(stack._tail.value).toBe(2);
      expect(stack.toArray()).toEqual(expect.arrayContaining([1, 2]))
    })

    test("remove middle item", () => {
      const stack = new LinkedStack(1, 2, 3);

      stack.removeAt(1);

      expect(stack.length).toBe(2);
      expect(stack._head.value).toBe(1);
      expect(stack._tail.value).toBe(3);
      expect(stack.toArray()).toEqual(expect.arrayContaining([1, 3]))
    })
  })
})