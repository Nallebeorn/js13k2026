#version 300 es
precision highp float;

in vec4 v; // .xyz = local vertex pos, .w = surface ID

uniform float i; // object index
uniform int c; // object color
uniform vec4 p[16]; // palette

layout(location=0) out vec4 o; // output color
layout(location=1) out vec4 s; // surface index

void main() {
	s = vec4(v.w, i, 0, 0) / 255.;
	o = c == 15 ? p[int((4. + (-v.w) * 7.))] : p[c];// + v * vec4(-.5, 1, .5, 0) * .1;
}
