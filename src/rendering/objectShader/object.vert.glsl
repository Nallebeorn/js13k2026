#version 300 es
in vec4 p;
uniform mat4 o2v;
uniform mat4 v2c;

void main() {
	gl_Position = v2c * o2v * p;
}
