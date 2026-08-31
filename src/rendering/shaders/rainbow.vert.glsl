#version 300 es
uniform mat4 o, w; // modelToWorld, worldToClip
out vec4 v; // .xyz = local vertex pos, .w = surface ID

void main() {
	int c = gl_VertexID > 2 ? gl_VertexID^3 : gl_VertexID; // corner
	v = vec4(
		float(c == 1 || c == 2) * 4. - 1.,
		0,
		float(c >= 2) * 4. - 1.,
		-float(c == 1 || c == 2)
	);
	gl_Position = w * o * vec4(v.xyz, 1);
	// gl_Position = vec4(vec2(gl_VertexID*4 & 4, gl_VertexID*4 & 8) - .5, 0, 1);
}
