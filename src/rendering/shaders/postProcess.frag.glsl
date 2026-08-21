#version 300 es
precision highp float;

in vec2 v; // clip-space position position
layout(location=0) out vec4 o; // output color

uniform sampler2D c, s; // c = color texture, s = surface index texture

void main() {
	vec4 t = texture(c, v*.5+.5);
	o = vec4(
		max(
			length(texture(s, v*.5+.5 + vec2(2./640., 0)) - texture(s, v*.5+.5)),
			length(texture(s, v*.5+.5 + vec2(0, 2./480.)) - texture(s, v*.5+.5))
		) > 0.
		// ? vec3(0.902, 0.251, 0.792)
		? vec3(0.671, 0.322, 0.212)
		: mix(
			mix(vec3(1), vec3(.698, 1, 1), v.y*0.5+0.3),
			t.rgb,
			t.a
		),
		1.
	);
}
