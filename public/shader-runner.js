const SHADERTOY_PRELUDE = `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform int iFrame;
uniform vec4 iMouse;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;
out vec4 fragColor;
`;

const SHADERTOY_EPILOGUE = `
void main() {
  vec4 c = vec4(0.0);
  mainImage(c, gl_FragCoord.xy);
  fragColor = c;
}
`;

const compileGlShader = (gl, type, source) => {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, source);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
};

export const createShaderToyRunner = (canvas, shaderSpec) => {
  const gl = canvas.getContext('webgl2', {
    antialias: false,
    alpha: false,
    premultipliedAlpha: false,
    powerPreference: 'default',
  });
  if (!gl) {
    console.warn('WebGL2 is not available; shader interlude will be empty.');
    return null;
  }

  const vsSrc = `#version 300 es
in vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;
  const vs = compileGlShader(gl, gl.VERTEX_SHADER, vsSrc);
  if (!vs) return null;

  const buildProgram = (body) => {
    const fsSrc = `${SHADERTOY_PRELUDE}\n${body}\n${SHADERTOY_EPILOGUE}`;
    const fs = compileGlShader(gl, gl.FRAGMENT_SHADER, fsSrc);
    if (!fs) return null;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, 'aPos');
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(fs);
      return null;
    }
    return {
      program,
      fs,
      uResolution: gl.getUniformLocation(program, 'iResolution'),
      uTime: gl.getUniformLocation(program, 'iTime'),
      uTimeDelta: gl.getUniformLocation(program, 'iTimeDelta'),
      uFrame: gl.getUniformLocation(program, 'iFrame'),
      uMouse: gl.getUniformLocation(program, 'iMouse'),
      uChan0: gl.getUniformLocation(program, 'iChannel0'),
      uChan1: gl.getUniformLocation(program, 'iChannel1'),
      uChan2: gl.getUniformLocation(program, 'iChannel2'),
      uChan3: gl.getUniformLocation(program, 'iChannel3'),
      uShapeProfile: gl.getUniformLocation(program, 'uShapeProfile'),
      uNoiseAmount: gl.getUniformLocation(program, 'uNoiseAmount'),
      uCutDepth: gl.getUniformLocation(program, 'uCutDepth'),
      uMorphSeed: gl.getUniformLocation(program, 'uMorphSeed'),
      uStoneTint: gl.getUniformLocation(program, 'uStoneTint'),
      uStoneType: gl.getUniformLocation(program, 'uStoneType'),
      uGrainScale: gl.getUniformLocation(program, 'uGrainScale'),
      uGrainContrast: gl.getUniformLocation(program, 'uGrainContrast'),
      uVeinAmount: gl.getUniformLocation(program, 'uVeinAmount'),
      uFractureAmount: gl.getUniformLocation(program, 'uFractureAmount'),
      uGlossiness: gl.getUniformLocation(program, 'uGlossiness'),
      uScatter: gl.getUniformLocation(program, 'uScatter'),
    };
  };

  const isMultipass = typeof shaderSpec === 'object' && shaderSpec !== null;
  const passA = buildProgram(isMultipass ? shaderSpec.bufferA : shaderSpec);
  if (!passA) {
    gl.deleteShader(vs);
    return null;
  }
  const passB = isMultipass ? buildProgram(shaderSpec.bufferB) : null;
  const passImage = isMultipass ? buildProgram(shaderSpec.image) : null;
  if (isMultipass && (!passB || !passImage)) {
    if (passB) { gl.deleteProgram(passB.program); gl.deleteShader(passB.fs); }
    if (passImage) { gl.deleteProgram(passImage.program); gl.deleteShader(passImage.fs); }
    gl.deleteProgram(passA.program);
    gl.deleteShader(passA.fs);
    gl.deleteShader(vs);
    return null;
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  const buildTexture = (data, w, h) => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    return tex;
  };

  const makeFurNoiseTexture = (size = 256) => {
    const data = new Uint8Array(size * size * 4);
    const cell = 8;
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const idx = (y * size + x) * 4;
        const cx = Math.floor(x / cell);
        const cy = Math.floor(y / cell);
        const n = Math.sin((cx * 12.9898 + cy * 78.233) * 0.125) * 43758.5453;
        const r = n - Math.floor(n);
        const density = Math.floor(Math.max(0, Math.min(1, r * 0.86 + 0.18)) * 255);
        const lenWave = 0.5 + 0.5 * Math.sin((cx * 0.8) + (cy * 0.55));
        const length = Math.floor(Math.max(0, Math.min(1, 0.42 + lenWave * 0.48)) * 255);
        data[idx + 0] = density;
        data[idx + 1] = length;
        data[idx + 2] = density;
        data[idx + 3] = 255;
      }
    }
    return { data, size };
  };

  const makeFurColorTexture = (size = 256) => {
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const idx = (y * size + x) * 4;
        const u = x / (size - 1);
        const v = y / (size - 1);
        const grain = 0.92 + 0.08 * Math.sin((x * 0.09) + (y * 0.13));
        const base = 70 + 140 * (0.35 * u + 0.65 * v);
        const c = Math.floor(Math.max(0, Math.min(255, base * grain)));
        data[idx + 0] = c;
        data[idx + 1] = c;
        data[idx + 2] = c;
        data[idx + 3] = 255;
      }
    }
    return { data, size };
  };

  const makeSolidTexture = (r, g, b, a = 255) => {
    const data = new Uint8Array([r, g, b, a, r, g, b, a, r, g, b, a, r, g, b, a]);
    return { data, size: 2 };
  };

  const furNoise = makeFurNoiseTexture(256);
  const furColor = makeFurColorTexture(256);
  const solidWhite = makeSolidTexture(255, 255, 255, 255);

  const tex0 = buildTexture(furNoise.data, furNoise.size, furNoise.size);
  const tex1 = buildTexture(furColor.data, furColor.size, furColor.size);
  const tex2 = buildTexture(solidWhite.data, solidWhite.size, solidWhite.size);
  const tex3 = buildTexture(solidWhite.data, solidWhite.size, solidWhite.size);

  const createTarget = () => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const fbo = gl.createFramebuffer();
    return { tex, fbo };
  };
  const rtA = isMultipass ? createTarget() : null;
  const rtB = isMultipass ? createTarget() : null;

  let lastKey = '';

  const resize = (opts = {}) => {
    const rect = canvas.getBoundingClientRect();
    const cssW = Math.max(1, Math.floor(rect.width));
    const cssH = Math.max(1, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const posScale = typeof opts.posScale === 'number' ? opts.posScale : 1;
    const quality = typeof opts.quality === 'number' ? opts.quality : 1;
    const rw = Math.max(1, Math.floor(cssW * dpr * posScale * quality));
    const rh = Math.max(1, Math.floor(cssH * dpr * posScale * quality));
    const k = `${rw}x${rh}`;
    if (k === lastKey) return;
    lastKey = k;
    canvas.width = rw;
    canvas.height = rh;
    gl.viewport(0, 0, rw, rh);
    if (isMultipass) {
      const alloc = (rt) => {
        gl.bindTexture(gl.TEXTURE_2D, rt.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, rw, rh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, rt.fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rt.tex, 0);
      };
      alloc(rtA);
      alloc(rtB);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
  };

  const bindAndUniform = (pass, tSec, dtSec, frame, mouse, chan0Override = null) => {
    gl.useProgram(pass.program);
    gl.bindVertexArray(vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, chan0Override || tex0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, tex1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, tex2);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, tex3);
    if (pass.uResolution) gl.uniform3f(pass.uResolution, canvas.width, canvas.height, 1.0);
    if (pass.uTime) gl.uniform1f(pass.uTime, tSec);
    if (pass.uTimeDelta) gl.uniform1f(pass.uTimeDelta, dtSec);
    if (pass.uFrame) gl.uniform1i(pass.uFrame, frame);
    if (pass.uChan0) gl.uniform1i(pass.uChan0, 0);
    if (pass.uChan1) gl.uniform1i(pass.uChan1, 1);
    if (pass.uChan2) gl.uniform1i(pass.uChan2, 2);
    if (pass.uChan3) gl.uniform1i(pass.uChan3, 3);
    if (pass.uShapeProfile) gl.uniform4f(pass.uShapeProfile, 0.5, 0.5, 0.5, 0.5);
    if (pass.uNoiseAmount) gl.uniform1f(pass.uNoiseAmount, 0.1);
    if (pass.uCutDepth) gl.uniform1f(pass.uCutDepth, 0.8);
    if (pass.uMorphSeed) gl.uniform1f(pass.uMorphSeed, 0.3);
    if (pass.uStoneTint) gl.uniform3f(pass.uStoneTint, 1.0, 1.0, 1.0);
    if (pass.uStoneType) gl.uniform1f(pass.uStoneType, 0.2);
    if (pass.uGrainScale) gl.uniform1f(pass.uGrainScale, 6.0);
    if (pass.uGrainContrast) gl.uniform1f(pass.uGrainContrast, 0.2);
    if (pass.uVeinAmount) gl.uniform1f(pass.uVeinAmount, 0.08);
    if (pass.uFractureAmount) gl.uniform1f(pass.uFractureAmount, 0.2);
    if (pass.uGlossiness) gl.uniform1f(pass.uGlossiness, 0.4);
    if (pass.uScatter) gl.uniform1f(pass.uScatter, 0.1);
    if (pass.uMouse) {
      const mx = mouse[0];
      const my = mouse[1];
      const mz = mouse[2];
      const mw = mouse[3];
      gl.uniform4f(pass.uMouse, mx, my, mz, mw);
    }
  };

  const render = (tSec, dtSec, frame, mouse) => {
    if (!isMultipass) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      bindAndUniform(passA, tSec, dtSec, frame, mouse);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, rtA.fbo);
    bindAndUniform(passA, tSec, dtSec, frame, mouse);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindFramebuffer(gl.FRAMEBUFFER, rtB.fbo);
    bindAndUniform(passB, tSec, dtSec, frame, mouse, rtA.tex);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    bindAndUniform(passImage, tSec, dtSec, frame, mouse, rtB.tex);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const dispose = () => {
    gl.deleteBuffer(buf);
    gl.deleteVertexArray(vao);
    gl.deleteTexture(tex0);
    gl.deleteTexture(tex1);
    gl.deleteTexture(tex2);
    gl.deleteTexture(tex3);
    if (isMultipass) {
      gl.deleteFramebuffer(rtA.fbo);
      gl.deleteTexture(rtA.tex);
      gl.deleteFramebuffer(rtB.fbo);
      gl.deleteTexture(rtB.tex);
      gl.deleteProgram(passB.program);
      gl.deleteShader(passB.fs);
      gl.deleteProgram(passImage.program);
      gl.deleteShader(passImage.fs);
    }
    gl.deleteProgram(passA.program);
    gl.deleteShader(passA.fs);
    gl.deleteShader(vs);
  };

  return { gl, resize, render, dispose };
};
