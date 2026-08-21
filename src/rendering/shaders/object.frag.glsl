#version 300 es
precision highp float;

in vec4 v; // .xyz = local vertex pos, .w = surface ID

uniform float i; // object index
uniform vec4 c; // object color

layout(location=0) out vec4 o; // output color
layout(location=1) out vec4 s; // surface index

void main() {
	s = vec4(v.w, i, 0, 0) / 255.;
	o = c;// + v * vec4(-.5, 1, .5, 0) * .1;
}
