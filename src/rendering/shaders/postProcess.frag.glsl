#version 300 es
precision highp float;

in vec2 v; // clip-space position position
layout(location=0) out vec4 o; // output color

uniform sampler2D c, s; // c = color texture, s = surface index texture

void main() {
	o = max(
		length(texture(s, v*.5+.5 + vec2(2./640., 0)) - texture(s, v*.5+.5)),
		length(texture(s, v*.5+.5 + vec2(0, 2./480.)) - texture(s, v*.5+.5))
	) > 0. ? vec4(0) : texture(c, v*.5+.5);

	// o.rgb = vec3(texture(s, v*.5+.5).g*20.);
	// o.a = 1.0;
}
