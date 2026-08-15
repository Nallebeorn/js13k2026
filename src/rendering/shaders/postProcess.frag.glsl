#version 300 es
precision highp float;

in vec2 v; // clip-space position position
layout(location=0) out vec4 o; // output color

uniform sampler2D c, s; // c = color texture, s = surface index texture

void main() {
	vec2 p = v * 0.5 + 0.5;
	o = mix(
		vec4(0),
		texture(c, p),
		step(
			0.,
			-max(
				abs(texture(s, p + vec2(2./640., 0)) - texture(s, p)).r,
				abs(texture(s, p + vec2(0, 2./480.)) - texture(s, p)).r
			)
		)
	);
}
