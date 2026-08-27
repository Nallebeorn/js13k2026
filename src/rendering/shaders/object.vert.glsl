#version 300 es
in vec4 p; // .xyz = local vertex pos, .w = surface ID
uniform mat4 o, w; // modelToWorld, worldToClip
out vec4 v; // .xyz = local vertex pos, .w = surface ID

void main() {
	gl_Position = w * o * vec4(p.xyz, 1);
	v = p;
}
