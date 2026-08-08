attribute vec2 aPos;
uniform mat4 uObjectToView;
uniform mat4 uViewToClip;

void main() {
	gl_Position = vec4(aPos.xy * 0.5, 0.0, 1.0);
}
