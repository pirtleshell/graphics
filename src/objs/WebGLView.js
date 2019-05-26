
import Vector3 from './Vector3';

class View {
  constructor(displayDiv, position, options) {
    this.container = displayDiv;
    this.position = new Vector3(position);

    this.options = Object.assign({
      clearFunc: null,
      postDraw: null,
    }, options);

    this.canvas = this.getCanvas();
    this.resizeCanvas();

    this.step = 0.0;

    this.gl = this.canvas.getContext('webgl');
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.program = this.initShaderProgram();
    this.buffers = this.initBuffers();
    this.attrs = {
      vertices: this.gl.getAttribLocation(this.program, 'aVertexPosition'),
      colors: this.gl.getAttribLocation(this.program, 'aVertexColor'),
    };
    this.uniforms = {
      projectionMatrix: this.gl.getUniformLocation(this.program, 'uProjectionMatrix'),
      modelViewMatrix: this.gl.getUniformLocation(this.program, 'uModelViewMatrix'),
    };

    this.container.addEventListener('resize', this.resizeCanvas, false);
  }

  animate(world) {
    let then = 0
    const doStep = now => {
      // world.shapes.forEach(shape => {
      //   if(shape.onAnimate)
      //     shape.onAnimate(shape, world);
      // })
      now *= 0.001;
      this.step += (now - then);
      then = now;
      this.draw(world);
      window.requestAnimationFrame(doStep);
    };

    window.requestAnimationFrame(doStep);
  }

  clear() {
    // TODO: clearFunc? aka background
    const backgroundColor = [0.0, 0.0, 0.0, 1.0];
    this.gl.clearColor(...backgroundColor);
    this.gl.clearDepth(1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  draw(world) {
    const gl = this.gl;

    this.clear();

    // Clear the canvas before we start drawing on it.

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.translate(modelViewMatrix,     // destination matrix
                   modelViewMatrix,     // matrix to translate
                   [-0.0, 0.0, -6.0]);  // amount to translate

    mat4.rotate(modelViewMatrix,
                modelViewMatrix,
                this.step,
                [0, 0, 1]);
    mat4.rotate(modelViewMatrix,
                modelViewMatrix,
                this.step * 0.7,
                [0, 1, 0]);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
      const numComponents = 3;  // pull out 2 values per iteration
      const type = gl.FLOAT;    // the data in the buffer is 32bit floats
      const normalize = false;  // don't normalize
      const stride = 0;         // how many bytes to get from one set of values to the next
                                // 0 = use type and numComponents above
      const offset = 0;         // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
      gl.vertexAttribPointer(
          this.attrs.vertices,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(this.attrs.vertices);
    }

    // Tell WebGL how to pull out the colors from the color buffer
    // into the vertexColor attribute.
    {
      const numComponents = 4;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.color);
      gl.vertexAttribPointer(
          this.attrs.colors,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(this.attrs.colors);
    }

      // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

    // Tell WebGL to use our program when drawing
    gl.useProgram(this.program);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
        this.uniforms.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        this.uniforms.modelViewMatrix,
        false,
        modelViewMatrix);

    {
      const vertexCount = 36;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
    // {
    //   const offset = 0;
    //   const vertexCount = 4;
    //   gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    // }
  }

  getCanvas() {
    if (this.canvas != null) return this.canvas;
    if (this.container.constructor.name === 'HTMLCanvasElement')
      return this.container;
    if (this.container.querySelector('canvas') !== null)
      return this.container.querySelector('canvas');

    // empty container
    while(this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    const canvas = document.createElement('canvas');
    this.container.appendChild(canvas);
    return canvas;
  }

  initBuffers() {
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
      // Front face
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0, -1.0, -1.0,

      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
       1.0,  1.0,  1.0,
       1.0,  1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,

      // Right face
       1.0, -1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0,  1.0,  1.0,
       1.0, -1.0,  1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0,
    ];

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW
    );

    const faceColors = [
      [1.0,  1.0,  1.0,  1.0],    // Front face: white
      [1.0,  0.0,  0.0,  1.0],    // Back face: red
      [0.0,  1.0,  0.0,  1.0],    // Top face: green
      [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
      [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
      [1.0,  0.0,  1.0,  1.0],    // Left face: purple
    ];
    let colors = [];
    faceColors.forEach(c => { colors = colors.concat(c, c, c, c); });

    const colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(colors),
      this.gl.STATIC_DRAW
    );


    const indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.

    const indices = [
      0,  1,  2,      0,  2,  3,    // front
      4,  5,  6,      4,  6,  7,    // back
      8,  9,  10,     8,  10, 11,   // top
      12, 13, 14,     12, 14, 15,   // bottom
      16, 17, 18,     16, 18, 19,   // right
      20, 21, 22,     20, 22, 23,   // left
    ];

    // Now send the element array to GL
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW
    );

    return {
      position: positionBuffer,
      color: colorBuffer,
      indices: indexBuffer,
    };
  }

  initShaderProgram() {
    const vertShaderSrc = `
      attribute vec4 aVertexPosition;
      attribute vec4 aVertexColor;

      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;

      varying lowp vec4 vColor;

      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
      }
    `;

    const fragShaderSrc = `
      varying lowp vec4 vColor;
      void main() {
        gl_FragColor = vColor;
      }
    `;

    const vertShader = this.loadShader(this.gl.VERTEX_SHADER, vertShaderSrc);
    const fragShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragShaderSrc);
    const shaderProgram = this.gl.createProgram();
    this.gl.attachShader(shaderProgram, vertShader);
    this.gl.attachShader(shaderProgram, fragShader);
    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      console.warn('Unable to initialize the shader program: ', this.gl.getProgramInfoLog(shaderProgram));
      return null;
    }
    return shaderProgram;
  }

  loadShader(type, src) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, src);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.warn('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  resizeCanvas() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }
}

export default View;
