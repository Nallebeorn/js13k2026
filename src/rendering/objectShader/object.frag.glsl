#version 300 es
precision highp float;

in float s;
layout(location=0) out vec4 c;

void main() {
	c.rgb = vec3(s / 5.);
	c.a = 1.;
}
