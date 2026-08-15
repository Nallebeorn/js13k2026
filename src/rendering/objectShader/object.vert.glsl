#version 300 es
in vec4 p; // .xyz = local vertex pos, .w = surface ID
uniform mat4 o2v, v2c; // objectToView, viewToClip
out vec4 v; // .xyz = local vertex pos, .w = surface ID

void main() {
	gl_Position = v2c * o2v * vec4(p.xyz, 1);
	v = p;
}
