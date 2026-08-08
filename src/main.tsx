import { render } from "preact";
import { App } from "./App.js";
import { add, dot } from "./math.ts";

console.log(add([1, 2, 3], [1, 2, 3]))
console.log(dot([1, 2, 3], [1, 2, 3]))
render(<App/>, document.getElementById("main")!);
