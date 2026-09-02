#version 300 es
in vec4 p; // .xyz = local vertex pos, .w = surface ID
uniform mat4 o, w; // modelToWorld, worldToClip
uniform float l, b; // length, bend;
out vec4 v; // .xyz = local vertex pos, .w = surface ID

void main() {
	vec3 P = p.xyz;
	P.z *= l;
	// radius = 3.
	if (b > 0. && P.z > b) {
		P.y -= 3. * (1.0 - cos((P.z - b) / 3. * 1.57));
		P.z = b + 3. * sin((P.z - b) / 3. * 1.57);
	}
	gl_Position = w * o * vec4(P, 1);
	v = p;
}
