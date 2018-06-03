let canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

let x = '#000000',
    y = 2;
//mouse interface
const docs = document.getElementById("docs");
const editor = document.querySelector(".editor");
const docBox = document.querySelector(".doc-mode");
const sketch = document.getElementById("sketch");
let mouse = {
    x: 0, y: 0,  // coordinates
    lastX: 0, lastY: 0, // last frames mouse position 
    b1: false, b2: false, b3: false, // buttons
    buttonNames: ["b1", "b2", "b3"],  // named buttons
}
//my own mouse event
const mouseEvent = function (event) {
    let bounds = canvas.getBoundingClientRect();
    // get the mouse coordinates, subtract the canvas top left and any scrolling
    mouse.x = event.pageX - bounds.left - scrollX;
    mouse.y = event.pageY - bounds.top - scrollY;
    // first normalize the mouse coordinates from 0 to 1 (0,0) top left
    // off canvas and (1,1) bottom right by dividing by the bounds width and height
    mouse.x /= bounds.width;
    mouse.y /= bounds.height;

    // then scale to canvas coordinates by multiplying the normalized coords with the canvas resolution

    mouse.x *= canvas.width;
    mouse.y *= canvas.height;

    if (event.type === "mousedown") {
        mouse[mouse.buttonNames[event.which - 1]] = true; 
        // set the button as down
    } else if (event.type === "mouseup") {
        mouse[mouse.buttonNames[event.which - 1]] = false;
         // set the button up
    }
};
//start the sketch
const init = function () {
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    // HTML <canvas id = "myCan"><canvas>
// To set the resolution use the canvas width and height properties
    canvas.width = 1024;
    canvas.height = 1024;
    w = canvas.width;
    h = canvas.height;
    pickColor();
    docBox.remove();
    clicksketch();
    fixDocs();



};

//start the color input
const color = function (obj) {
    
    if (obj === '#000000') {
        x = '#000000';
    } else {
        x = obj;
    }

    if (x == '#FFFFFF') y = 14;
    else y = 2;




};

//choosing a color function and drwaing
const pickColor = function () {
    const colorinput = document.getElementById("colorPicker").value;
    const getColors = document.getElementById("colorPicker");
    getColors.addEventListener('input', function(e){
        color(this.value);
        console.log('worked');
    });
    canvas.addEventListener("mousemove", mouseEvent);
    canvas.addEventListener("mousedown", mouseEvent);
    canvas.addEventListener("mouseup", mouseEvent);
    
    // start the app
    requestAnimationFrame(mainLoop);
}

//main loop for mouse events and drawing
const mainLoop = function (time) {
    if (mouse.b1) {  // is button 1 down
        draw();
    }


    // save the last known mouse coordinate here not in the mouse event
    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;
    requestAnimationFrame(mainLoop); // get next frame
}

//drwa function
const draw = function () {
    ctx.beginPath();
    ctx.moveTo(mouse.lastX, mouse.lastY);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
};

const erase = function () {
    var m = confirm("Want to clear");
    if (m) {
        ctx.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "none";
    }
};

const save = function () {
    document.getElementById("canvasimg").style.border = "2px solid";
    var dataURL = canvas.toDataURL();
    document.getElementById("canvasimg").src = dataURL;
    document.getElementById("canvasimg").style.display = "inline";
};



const fixDocs = function(){
   
    docs.addEventListener('click', function(){
        editor.remove();
        docBox.remove();

        mainflag = true;
        if(mainflag){
           document.body.appendChild(docBox);
        }else{
            document.body.appendChild(editor);
            mainflag = false;
        }
    });
}

function clicksketch (){
       sketch.addEventListener("click", function(){
             document.body.appendChild(editor);
             init();
       });
}

init();

