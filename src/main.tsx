import { render } from "preact";
import { App } from "./App.js";
import { add, dot } from "./math.ts";
import vertexShaderSource from "./vertex.glsl";
import fragmentShaderSource from "./fragment.glsl";

render(<App/>, document.getElementById("main")!);

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl")!;

const shader = createShaderProgram(vertexShaderSource, fragmentShaderSource);
const programInfo = {
	aPos: gl.getAttribLocation(shader, "aPos"),
	uObjectToView: gl.getUniformLocation(shader, "uObjectToView"),
	uViewToClip: gl.getUniformLocation(shader, "uViewToClip"),
};
gl.useProgram(shader)

const planePosBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, planePosBuffer);
gl.bufferData(
	gl.ARRAY_BUFFER,
	new Float32Array([1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]),
	gl.STATIC_DRAW
);
gl.vertexAttribPointer(programInfo.aPos, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(programInfo.aPos);

gl.clearColor(0.3, 0.6, 0.9, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

function createShaderProgram(vertexSource: string, fragmentSource: string) {
	const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
	const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (DEBUG) {
	 if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	    console.error(
	      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
	        shaderProgram,
	      )}`,
	    );
	  }
	}

  return shaderProgram;
}

type ShaderType = WebGLRenderingContext["VERTEX_SHADER"] | WebGLRenderingContext["FRAGMENT_SHADER"]
function compileShader(type: ShaderType, source: string) {
	const shader = gl.createShader(type)!;
	gl.shaderSource(shader, source);
	gl.compileShader(shader)

	if (DEBUG) {
		console.log("debug build");
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	    console.error(
	      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
			);
			console.info("Failing shader source:");
			console.info(source);
	    gl.deleteShader(shader);
	  }
	}

	return shader;
}
