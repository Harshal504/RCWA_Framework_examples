let isErasing = false;

// Get the canvas element and its context
const canvas = document.getElementById('canvas_whiteboard')
const ctx = canvas.getContext('2d')

// Set up variables to track the mouse state
let isDrawing = false
let lastX = 0
let lastY = 0

// This function clear all the values
function clearScreen() {
  document.getElementById("result").value = "";
}

    // This function display values
function display(value) {
  document.getElementById("result").value += value;
}

    // This function evaluates the expression and returns result
function calculate() {
  var p = document.getElementById("result").value;
  var q = eval(p);
  document.getElementById("result").value = q;
}

function onCanvasMouseDown(e, isDrawing, isErasing, lastX, lastY, ctx, ws, updateValues) {
  lastX = e.offsetX
  lastY = e.offsetY
  if(typeof updateValues == "function") {
    updateValues({ lastX: e.offsetX, lastY: e.offsetY, isDrawing: true })
  }
  ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
  ctx.lineWidth = isErasing ? 30 : 1; // Set line width based on whether we're erasing or not
  console.log(ctx)
  ws.send(JSON.stringify({ type: 'mousedown', x: lastX, y: lastY, erasing: isErasing }))
}

function onCanvasMouseMove(e, isDrawing, isErasing, imgUpdating, lastX, lastY, ctx, ws, updateValues) {
  if (!isDrawing) return
  if(imgUpdating) return
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(e.offsetX, e.offsetY)
  ctx.stroke()
  lastX = e.offsetX
  lastY = e.offsetY
  if(typeof updateValues == "function") {
    updateValues({ lastX: e.offsetX, lastY: e.offsetY })
  }

  // Send draw data to server using socket.io
  ws.send(JSON.stringify({ type: 'mousemove', x: lastX, y: lastY, erasing: isErasing }))
}

function onCanvasMouseUp(e, isDrawing, isErasing, lastX, lastY, ctx, ws, updateValues) {
  if(typeof updateValues) {
    updateValues({ isDrawing: false })
  }
  ws.send(JSON.stringify({ type: "mouseup", erasing: isErasing }))
}

function onDraw(isDrawing, isErasing, updateValues) {
  if(typeof updateValues == "function") {
    updateValues({ isDrawing: true, isErasing: false })
  }
}

function onErase(isDrawing, isErasing, updateValues) {
  if(typeof updateValues == "function") {
    updateValues({ isDrawing: false, isErasing: true })
  }
}

// Event listener for mouse down
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true
  lastX = e.offsetX
  lastY = e.offsetY
  ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
  ctx.lineWidth = isErasing ? 30 : 1; // Set line width based on whether we're erasing or not
  //ws.send(JSON.stringify({ type: 'mousedown', x: lastX, y: lastY, erasing: isErasing }))
})

// Event listener for mouse move
canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return
  if(imgUpdating) return
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(e.offsetX, e.offsetY)
  ctx.stroke()
  lastX = e.offsetX
  lastY = e.offsetY
  // Send draw data to server using socket.io
  //ws.send(JSON.stringify({ type: 'mousemove', x: lastX, y: lastY, erasing: isErasing }))
})

// Event listener for mouse up
canvas.addEventListener('mouseup', () => {
  isDrawing = false
  //ws.send(JSON.stringify({ type: "mouseup", erasing: isErasing }))
})

// Add event listener for a button to switch to eraser
document.getElementById('erase').addEventListener('click', () => {
  isErasing = true
  isDrawing = false
})

document.getElementById('pencil').addEventListener('click', () => {
  isErasing = false
  isDrawing = true
})

enableWhiteBoard(canvas, ctx, document.getElementById("pencil"), document.getElementById("erase"))
