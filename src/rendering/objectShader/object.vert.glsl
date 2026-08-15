#version 300 es
in vec4 p;
uniform mat4 o2v;
uniform mat4 v2c;
out float s;

void main() {
	gl_Position = v2c * o2v * vec4(p.xyz, 1);
	s = p.w;
}
