#version 300 es
precision highp float;

in vec4 v; // .xyz = local vertex pos, .w = surface ID
layout(location=0) out vec4 c; // color

void main() {
	c.rgb = vec3(v.w / 5.);
	c.a = 1.;
}
