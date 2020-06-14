import AND_GATE from "@assets/svg_elements/AND_ANSI.svg";
import OR_GATE from "@assets/svg_elements/OR_ANSI.svg";
import NOT_GATE from "@assets/svg_elements/NOT_ANSI.svg";
import XOR_GATE from "@assets/svg_elements/XOR_ANSI.svg";
import DELAY_GATE from "@assets/svg_elements/Buffer_ANSI.svg";


const imageURLs = {
  "and": AND_GATE,
  "or": OR_GATE,
  "not": NOT_GATE,
  "xor": XOR_GATE,
  "delay": DELAY_GATE,
}

const imageStore = {
  "_and": AND_GATE,
  "_or": OR_GATE,
  "_not": NOT_GATE,
  "_xor": XOR_GATE,
  "_delay": DELAY_GATE,
}

let isStoreLoading = false;
let isStoreInitComplete = false;

Object.keys(imageStore).forEach(key => {
  const normalKey = key.substring(1);
  Object.defineProperty(imageStore, normalKey, {
    get: function() {
      if (!isStoreInitComplete && !isStoreLoading) {
        init();
      }

      return this[key];
    },
    set: function(value) {
      this[key] = value;
    } 
  })
});

const init = () => {
  isStoreLoading = true;
  Promise.all(Object.entries(imageURLs).map(([name, url]) =>
    loadImage(url)
      .then(imageEl => addImageToStore(name, imageEl))
      .catch((err) => {
        console.error(`Error on loading ${url}`);
      }))
  )
    .then(() => {
      isStoreLoading = false;
      isStoreInitComplete = true;
    });
}

const addImageToStore = (key, imageEl) => {
  imageStore[key] = imageEl;
}

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const imageEl = new Image();
    imageEl.onload = () => {
      resolve(imageEl);
    }
    imageEl.onerror = reject;
    imageEl.src = url;
  });
}

export default imageStore;