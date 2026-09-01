#version 300 es
in vec4 p; // .xyz = local vertex pos, .w = surface ID
uniform mat4 o, w; // modelToWorld, worldToClip
uniform float l, b; // length, bend;
out vec4 v; // .xyz = local vertex pos, .w = surface ID

void main() {
	vec3 P = p.xyz;
	P.z *= l;
	// P.y += sin(p.z * 1.57) * 5.;
	// P.z -= sin(p.z * 3.14);
	// P.y += sin(P.z * (l-1.));
	gl_Position = w * o * vec4(P, 1);
	v = p;
}
