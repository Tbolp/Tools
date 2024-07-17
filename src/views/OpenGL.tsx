import { Button, Container } from "@mui/material";
import { useRef } from "react";

let vs_src = `#version 300 es
precision mediump float;
layout(location = 0) in vec2 pos;
void main() {
  gl_Position = vec4(pos, 1.0, 1.0);
}
`

let fs_src = `#version 300 es
precision mediump float;
uniform vec2 tran;
uniform float scale;
out vec4 fragColor;

#define complex vec2

complex multi(complex a, complex b) {
  return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x);
}

float norm(complex a) {
  return a.x*a.x+a.y*a.y;
}

vec3 calc(complex pt, int count, float value) {
  complex z = complex(0.0, 0.0);
  vec3 color1 = vec3(0.0, 0.8, 0.0);
  vec3 color2 = vec3(1.0, 1.0, 1.0);
  for (int i = 0; i < count; ++i) {
    z = multi(z, z) + pt;
    if (norm(z) > value) {
      float s = float(i) / float(count);
      s = 0.0;
      return color1*s+color2*(1.0-s);
    }
  }
  return color1;
}

void main() {
  fragColor = vec4(calc((gl_FragCoord.xy+tran)*scale, 100, 1000.0), 1.0);
}
`

let gl: WebGL2RenderingContext
let vbo: WebGLBuffer
let vao: WebGLVertexArrayObject

// 创建渲染流水线
function createProgram(gl: WebGLRenderingContext) {
  let prog = gl.createProgram()!
  // 创建并编译Vertex Shader
  let vs = gl.createShader(gl.VERTEX_SHADER)!
  gl.shaderSource(vs, vs_src)
  gl.compileShader(vs)
  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(vs))
    gl.deleteShader(vs)
  }
  gl.attachShader(prog, vs)
  // 创建并编译Fragment Shader
  let fs = gl.createShader(gl.FRAGMENT_SHADER)!
  gl.shaderSource(fs, fs_src)
  gl.compileShader(fs)
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(fs))
    gl.deleteShader(fs)
  }
  gl.attachShader(prog, fs)
  // 链接Program
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(prog))
  }
  gl.useProgram(prog)
  return prog
}

export default function () {
  let canvas_ref = useRef<HTMLCanvasElement>(null)
  return (
    <Container>
      <Button onClick={() => {
        let elt = canvas_ref.current!
        gl = elt.getContext('webgl2')!
        let prog = createProgram(gl)
        // 创建Vertex Array Object(VAO)
        vao = gl.createVertexArray()!
        // 创建Vertex Buffer Object(VBO)
        vbo = gl.createBuffer()!
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
        // 绑定VAO记录操作
        gl.bindVertexArray(vao)
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        gl.enableVertexAttribArray(0)
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
        gl.bindVertexArray(null)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        let tran_loc = gl.getUniformLocation(prog, 'tran')!
        let scale_loc = gl.getUniformLocation(prog, 'scale')!
        gl.uniform2f(tran_loc, -elt.width * 0.7, -elt.height * 0.5)
        gl.uniform1f(scale_loc, 1 / (elt.width * 0.2))
      }}>Init</Button>
      <Button onClick={() => {
        let elt = canvas_ref.current!
        gl.bindVertexArray(vao)
        // 清除背景色
        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        // 设置视窗
        gl.viewport(0, 0, elt.width, elt.height)
        // 绘制三角形
        gl.drawArrays(gl.TRIANGLES, 0, 6)
      }}>Render</Button>
      {/* <canvas ref={canvas_ref} width={640} height={480} /> */}
      {/* <canvas ref={canvas_ref} width={1920} height={1080} /> */}
      {/* <canvas ref={canvas_ref} width={3840} height={2160} /> */}
      <canvas ref={canvas_ref} width={2400} height={1080} />
    </Container>
  )
}