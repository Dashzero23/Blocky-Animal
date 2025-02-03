// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
/*Nguyen Vu 
npvu@ucsc.edu*/
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

// Global variable
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL()
{
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});

    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }

    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL()
{
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// UI global
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_segmentCount = 10;
let g_globalAngle = 0;

let headAngle = 0;
let upperAngle = 0;
let lowerAngle = 0;

let headAnim = false;
let legAnim = false;

function addActionsForHtmlUI()
{

  document.getElementById('animHeadOnButton').onclick = function() {headAnim = true};
  document.getElementById('animHeadOffButton').onclick = function() {headAnim = false};

  document.getElementById('leftSlide').addEventListener('mousemove', function() { headAngle = this.value; renderAllShapes(); });
  document.getElementById('upperSlide').addEventListener('mousemove', function() { upperAngle = this.value; renderAllShapes(); });
  document.getElementById('lowerSlide').addEventListener('mousemove', function() { lowerAngle = this.value; renderAllShapes(); });

  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });

}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.5, 0.0, 1.0);

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000;
var g_seconds = performance.now()/1000 - g_startTime;

function tick()
{
  g_seconds = performance.now()/1000 - g_startTime;
  console.log(g_seconds);

  updateAnimationAngles();

  renderAllShapes();

  requestAnimationFrame(tick);
}

function updateAnimationAngles()
{
  if(headAnim)
  {
    headAngle = 15*Math.sin(g_seconds);
  }

  if(legAnim)
  {
    upperAngle = 45*Math.sin(3*g_seconds);
  }  
}

function renderAllShapes()
{
  var startTime = performance.now();

  var color = [1, 0.7, 0.8, 1];

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  var body = new Cube();
  body.color = [1, 0.7, 0.8, 1];
  body.matrix.translate(-0.2, 0, -0.15);
  body.matrix.scale(0.4, 0.4, 0.7);
  body.render();

  // HEAD
  var head = new Cube();
  head.color = color;
  head.matrix.rotate(-headAngle, 1, 0, 0);
  head.matrix.scale(0.35, 0.35, 0.35);
  head.matrix.translate(-0.5, 0.25, -1.25);
  head.render();

  var leftEye1 = new Cube();
  leftEye1.color = [1, 1, 1, 1];
  leftEye1.matrix.rotate(-headAngle, 1, 0, 0);
  leftEye1.matrix.scale(0.1, 0.05, 0.05);
  leftEye1.matrix.translate(-1.5, 5, -9);
  leftEye1.render();

  var leftEye2 = new Cube();
  leftEye2.color = [0, 0, 0, 1];
  leftEye2.matrix.rotate(-headAngle, 1, 0, 0);
  leftEye2.matrix.scale(0.05, 0.05, 0.05);
  leftEye2.matrix.translate(-3, 5, -9.05);
  leftEye2.render();

  var rightEye1 = new Cube();
  rightEye1.color = [1, 1, 1, 1];
  rightEye1.matrix.rotate(-headAngle, 1, 0, 0);
  rightEye1.matrix.scale(0.1, 0.05, 0.05);
  rightEye1.matrix.translate(0.5, 5, -9);
  rightEye1.render();

  var rightEye2 = new Cube();
  rightEye2.color = [0, 0, 0, 1];
  rightEye2.matrix.rotate(-headAngle, 1, 0, 0);
  rightEye2.matrix.scale(0.05, 0.05, 0.05);
  rightEye2.matrix.translate(2, 5, -9.05);
  rightEye2.render();

  // LEGS
  var frontLeft1 = new Cube();
  frontLeft1.color = color;
  frontLeft1.matrix.rotate(-upperAngle, 0, 0, 1);
  var frontLeftCoord = new Matrix4(frontLeft1.matrix);
  frontLeft1.matrix.scale(0.1, -0.2, 0.1);
  frontLeft1.matrix.translate(-1.15, -0.25, -0.75);
  frontLeft1.render();

  var frontLeft2 = new Cube();
  frontLeft2.color = color;
  frontLeft2.matrix = frontLeftCoord;
  frontLeft2.matrix.rotate(-lowerAngle, 0, 0, 1);
  frontLeft2.matrix.scale(0.11, 0.11, 0.11);
  frontLeft2.matrix.translate(-1.1, -2, -0.7);
  frontLeft2.render();


  var frontRight1 = new Cube();
  frontRight1.color = color;
  frontRight1.matrix.rotate(upperAngle, 0, 0, 1);
  var frontRightCoord = new Matrix4(frontRight1.matrix);
  frontRight1.matrix.scale(0.1, -0.2, 0.1);
  frontRight1.matrix.translate(0.2, -0.25, -0.75);
  frontRight1.render();

  var frontRight2 = new Cube();
  frontRight2.color = color;
  frontRight2.matrix = frontRightCoord;
  frontRight2.matrix.rotate(lowerAngle, 0, 0, 1);
  frontRight2.matrix.scale(0.11, 0.11, 0.11);
  frontRight2.matrix.translate(0.15, -2, -0.7);
  frontRight2.render();


  var backLeft1 = new Cube();
  backLeft1.color = color;
  backLeft1.matrix.rotate(-upperAngle, 0, 0, 1);
  var backLeftCoord = new Matrix4(backLeft1.matrix);
  backLeft1.matrix.scale(0.1, -0.2, 0.1);
  backLeft1.matrix.translate(-1.15, -0.25, 3);
  backLeft1.render();

  var backLeft2 = new Cube();
  backLeft2.color = color;
  backLeft2.matrix = backLeftCoord;
  backLeft2.matrix.rotate(-lowerAngle, 0, 0, 1);
  backLeft2.matrix.scale(0.11, 0.11, 0.11);
  backLeft2.matrix.translate(-1.1, -2, 2.7);
  backLeft2.render();

  var backRight1 = new Cube();
  backRight1.color = color;
  backRight1.matrix.rotate(upperAngle, 0, 0, 1);
  var backRightCoord = new Matrix4(backRight1.matrix);
  backRight1.matrix.scale(0.1, -0.2, 0.1);
  backRight1.matrix.translate(0.2, -0.25, 3);
  backRight1.render();

  var backRight2 = new Cube();
  backRight2.color = color;
  backRight2.matrix = backRightCoord;
  backRight2.matrix.rotate(lowerAngle, 0, 0, 1);
  backRight2.matrix.scale(0.11, 0.11, 0.11);
  backRight2.matrix.translate(0.15, -2, 2.7);
  backRight2.render();
  
  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");
}

function sendTextToHTML(text, htmlID)
{
  var htmlElm = document.getElementById(htmlID);

  if (!htmlElm)
  {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }

  htmlElm.innerHTML = text;
}
