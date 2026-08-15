#version 300 es
precision highp float;

in vec4 v; // .xyz = local vertex pos, .w = surface ID

uniform float i; // object index

layout(location=0) out vec4 o; // output color
layout(location=1) out vec4 s; // surface index

void main() {
	s = vec4(v.w, i, 0, 0) / 255.;
	o = vec4(v.xyz * .5 + .5, 1);
}
