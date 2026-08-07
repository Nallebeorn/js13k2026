import { useState } from "preact/hooks";

function* range(from: number, to: number) {
  while(from < to) yield from++
}
export function App() {
	const [counter, setCounter] = useState(0);

	const items = [...range(0, counter).map(i => <li>{i}</li>)];

	function increment() {
		setCounter(counter + 1);
	}

	return <>
		<h1>Hello World!</h1>
		<p>
			Counter: {counter}×
		</p>
		<ul>{items}</ul>
		<button onClick={increment}>Increment</button>
	</>;
}
