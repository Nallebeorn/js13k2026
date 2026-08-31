#version 300 es
precision highp float;

in vec2 v; // clip-space position position
layout(location=0) out vec4 o; // output color

// c = color texture, s = surface index texture, d = depth texture
uniform sampler2D c, s, d;

void main() {
	o = vec4(
		max(
			length(texture(s, v*.5+.5 + vec2(2./640., 0)) - texture(s, v*.5+.5)),
			length(texture(s, v*.5+.5 + vec2(0, 2./480.)) - texture(s, v*.5+.5))
		) > 0. // surface index outlines
		||
		max(
			abs(texture(d, v*.5+.5 + vec2(2./640., 0)).r  - texture(d, v*.5+.5).r),
			abs(texture(d, v*.5+.5 + vec2(0, 2./480.)).r  - texture(d, v*.5+.5).r)
		) > .0005 // depth outlines
		// ? vec3(0.902, 0.251, 0.792)
		?vec3(.467, .2, .067)
		:mix(
			mix(vec3(1), vec3(.698, 1, 1), v.y*0.5+0.3), // sky gradient
			texture(c, v*.5+.5).rgb,
			texture(c, v*.5+.5).a
		),
		1.
	);
	// o = vec4(texture(c, v*.5+.5).rgb, 1);
	// o = texture(d, v*.5+.5);
}
