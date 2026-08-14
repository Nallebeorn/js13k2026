import vertexShaderSource from "./object.vert.glsl";
import fragmentShaderSource from "./object.frag.glsl";
import { GL_ARRAY_BUFFER, GL_COLOR_BUFFER_BIT, GL_FLOAT, GL_STATIC_DRAW, GL_TRIANGLE_STRIP } from "./webgl/glConstants.ts";
import { createShaderProgram } from "./webgl/shader.ts";
import { gl } from "./webgl/webglContext.ts";
import { projectPerspective, transform} from "./math.ts";

if (DEBUG) {
	console.log("ℹ️ DEBUG BUILD");
}

const shader = createShaderProgram(vertexShaderSource, fragmentShaderSource);
const programInfo = {
	p: 0,
	o2v: gl.getUniformLocation(shader, "o2v"),
	v2c: gl.getUniformLocation(shader, "v2c"),
};

gl.useProgram(shader)

const planePosBuffer = gl.createBuffer();
gl.bindBuffer(GL_ARRAY_BUFFER, planePosBuffer);
gl.bufferData(
GL_ARRAY_BUFFER,
	new Float32Array([1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]),
	GL_STATIC_DRAW
);
gl.vertexAttribPointer(programInfo.p, 2, GL_FLOAT, false, 0, 0);
gl.enableVertexAttribArray(programInfo.p);

gl.clearColor(1, 1, 1, 1);
gl.clear(GL_COLOR_BUFFER_BIT);

const fov = Math.PI / 4;
const aspect = canvas.clientWidth / canvas.clientHeight;
const projectionMatrix = projectPerspective(fov, aspect, 0.1);

const objectToViewMatrix = transform([0, 0, -6], [0, 0, 1], Math.PI/3);

// Set the shader uniforms
gl.uniformMatrix4fv(
  programInfo.v2c,
  false,
  projectionMatrix,
);
gl.uniformMatrix4fv(
  programInfo.o2v,
  false,
  objectToViewMatrix,
);

gl.drawArrays(GL_TRIANGLE_STRIP, 0, 4);
