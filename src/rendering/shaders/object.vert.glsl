#version 300 es
in vec4 p; // .xyz = local vertex pos, .w = surface ID
uniform mat4 o2w, w2c; // objectToWorld, worldToClip
out vec4 v; // .xyz = local vertex pos, .w = surface ID

void main() {
	gl_Position = w2c * o2w * vec4(p.xyz, 1);
	v = p;
}
