#version 300 es
in vec4 p; // .xyz = local vertex pos, .w = surface ID
uniform mat4 o, w; // modelToWorld, worldToClip
uniform float l, b; // length, bend;
out vec4 v; // .xyz = local vertex pos, .w = surface ID

void main() {
	vec3 P = p.xyz;
	P.z *= l;
	float r = 2.5;
	if (b > 0. && P.z > b) {
		float t = (P.z - b) / r;
		float angle = t * 1.57;
		float z0 = b;
		P.z = z0 + r * sin(angle);
		P.y -= r * (1.0 - cos(angle));
	}
	// if (P.z >= b + radius) {
		// P.z = b + radius;
		// P.y = radius * (-P.z + (b - radius));
	// }
	// P.y -= .5 * l * sin(1.57 * clamp(((p.z - .5) / .5), 0., 1.));
	// P.z += cos(1.57 * clamp(((p.z - .5) / .5), 0., 1.));
	// P.y += sin(p.z * 1.57) * 5.;
	// P.z -= sin(p.z * 3.14);
	// P.y += sin(P.z * (l-1.));
	gl_Position = w * o * vec4(P, 1);
	v = p;
}
