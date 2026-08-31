#version 300 es
in vec4 p; // .xyz = local vertex pos, .w = surface ID
uniform mat4 o, w; // modelToWorld, worldToClip
uniform float l; // length;
out vec4 v; // .xyz = local vertex pos, .w = surface ID

void main() {
	vec3 P = p.xyz;
	if (P.z>0.) {
		P.z += l;
	}
	gl_Position = w * o * vec4(P, 1);
	v = p;
}
