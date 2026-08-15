#version 300 es
precision highp float;

in vec2 v; // clip-space position position
layout(location=0) out vec4 o; // output color

uniform sampler2D c; // input color texture
uniform sampler2D s; // surface index texture

void main() {
	vec2 p = v * 0.5 + 0.5;
	o = mix(texture(c, p), vec4(p, 0, 1), .5);
}
