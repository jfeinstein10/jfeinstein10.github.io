(function() {
  var gl = GL.create(),
    plane = GL.Mesh.plane({ coords: true }),
    width = 32,
    height = 32,
    textures = prepareSimulationTextures(width, height),
    shaders = prepareShaders(width, height),
    backgroundColor = [0.18, 0.20, 0.29, 1.0],
    foregroundColor = [0.20, 0.22, 0.31, 1.0];
  gl.ondraw = _.throttle(onDraw, 1000);
  gl.clearColor.apply(gl, backgroundColor);
  attachCanvas(gl);
  gl.animate();
  onDraw();

  ////////

  function onDraw() {
    gl.loadIdentity();

    // Take a game-of-life step
    textures.front.drawTo(function() {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      textures.back.bind(0);
      shaders.simulation.uniforms({
        state: 0,
        scale: [width, height]
      }).draw(plane);
      textures.back.unbind(0);
    });
    // Render a stylized front texture
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    textures.front.bind(0);
    shaders.stylize.uniforms({
      state: 0,
      scale: [width, height],
      backgroundColor: backgroundColor,
      foregroundColor: foregroundColor
    }).draw(plane);
    textures.front.unbind(0);
    // Swap back and front textures
    textures.front.swapWith(textures.back);
  }

  function attachCanvas(gl) {
    $(gl.canvas).addClass('canvas--background v-100 h-100 fixed-top');
    document.body.appendChild(gl.canvas);
    function resize() {
      gl.canvas.width = window.innerWidth;
      gl.canvas.height = window.innerHeight;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.ondraw();
    }
    window.addEventListener('resize', resize);
    resize();
  }

  function prepareSimulationTextures(width, height) {
    var rgba = new Uint8Array(width * height * 4);
    for (var i = 0; i < width * height; i++) {
      var ii = i * 4;
      rgba[ii + 0] = rgba[ii + 1] = rgba[ii + 2] = Math.random() < 0.4 ? 255 : 0;
      rgba[ii + 3] = 255;
    }
    return {
      front: new GL.Texture(width, height, {filter: gl.NEAREST, wrap: gl.REPEAT}),
      back: new GL.Texture(width, height, { data: rgba, filter: gl.NEAREST, wrap: gl.REPEAT })
    }
  }

  function prepareShaders() {
    var quadVert = '\
      varying vec2 coord;\
      void main() {\
        coord = gl_TexCoord.xy;\
        gl_Position = vec4(gl_Vertex.xy, 0.0, 1.0);\
      }\
    ';

    var stylizeFrag = '\
      uniform sampler2D state;\
      uniform vec2 scale;\
      uniform vec4 backgroundColor;\
      uniform vec4 foregroundColor;\
      varying vec2 coord;\
      \
      void main() {\
        vec2 m = mod(coord, 1.0/scale) * scale;\
        if (m.x < 0.1 || m.x > 0.9 || m.y < 0.1 || m.y > 0.9) {\
          gl_FragColor = backgroundColor;\
        } else {\
          bool off = texture2D(state, coord).r == 0.0;\
          gl_FragColor = off ? backgroundColor : foregroundColor;\
        }\
      }\
    ';

    var simulationFrag = '\
      uniform sampler2D state;\
      uniform vec2 scale;\
      varying vec2 coord;\
      \
      int get(vec2 offset) {\
          return int(texture2D(state, coord + offset/scale).r);\
      }\
      \
      void main() {\
          int sum =\
              get(vec2(-1.0, -1.0)) +\
              get(vec2(-1.0,  0.0)) +\
              get(vec2(-1.0,  1.0)) +\
              get(vec2( 0.0, -1.0)) +\
              get(vec2( 0.0,  1.0)) +\
              get(vec2( 1.0, -1.0)) +\
              get(vec2( 1.0,  0.0)) +\
              get(vec2( 1.0,  1.0));\
          if (sum == 3) {\
              gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\
          } else if (sum == 2) {\
              float current = float(get(vec2(0.0, 0.0)));\
              gl_FragColor = vec4(current, current, current, 1.0);\
          } else {\
              gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\
          }\
      }\
    ';
    return {
      simulation: new GL.Shader(quadVert, simulationFrag),
      stylize: new GL.Shader(quadVert, stylizeFrag)
    };
  }

})();
