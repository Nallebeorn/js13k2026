#version 300 es
precision highp float;

in vec4 v; // .xyz = local vertex pos, .w = surface ID
layout(location=0) out vec4 o; // output color
layout(location=1) out float s; // surface index

void main() {
	s = v.w/255.;
	o = vec4(v.xyz * 0.5 + 0.5, 1);
}
