
//The Model for all the Data
class Model {
  constructor() {
    this.mouse = {
      x: 0,
      y: 0, // coordinates
      lastX: 0,
      lastY: 0, // last frames mouse position
      b1: false,
      b2: false,
      b3: false, // buttons
      buttonNames: ["b1", "b2", "b3"], // named buttons
    };

    this.canvas = false;
    this.ctx = false;
    this.flag = false;
    this.prevX = 0;
    this.currX = 0;
    this.prevY = 0;
    this.currY = 0;
    this.dot_flag = false;

    this.docs = document.getElementById("docs");
    this.editor = document.querySelector(".editor");
    this.docBox = document.querySelector(".doc-mode");
    this.sketch = document.getElementById("sketch");
  }
}

//The controller to connect the Model and the view
class Controller {

  //Adds Model and View to the controller
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  //The mouse event system handels Drawing
  mouseEvent(event) {
    let bounds = mainApp.model.canvas.getBoundingClientRect();
    // get the mouse coordinates, subtract the canvas top left and any scrolling
    mainApp.model.mouse.x = event.pageX - bounds.left - scrollX;
    mainApp.model.mouse.y = event.pageY - bounds.top - scrollY;
    // first normalize the mouse coordinates from 0 to 1 (0,0) top left
    // off canvas and (1,1) bottom right by dividing by the bounds width and height
    mainApp.model.mouse.x /= bounds.width;
    mainApp.model.mouse.y /= bounds.height;

    // then scale to canvas coordinates by multiplying the normalized coords with the canvas resolution

    mainApp.model.mouse.x *= mainApp.model.canvas.width;
    mainApp.model.mouse.y *= mainApp.model.canvas.height;

    if (event.type === "mousedown") {
      mainApp.model.mouse[mainApp.model.mouse.buttonNames[event.which - 1]] = true;
      // set the button as down
    } else if (event.type === "mouseup") {
      mainApp.model.mouse[mainApp.model.mouse.buttonNames[event.which - 1]] = false;
      // set the button up
    }
  }

  //Function to change color
  color(obj) {
    let x, y;

    if (obj === '#000000') {
         x = '#000000';
    } else {
         x = obj;
    }

    if (x == '#FFFFFF') y = 14;
    else y = 2;

    //Update the Model
    this.model.x = x;
    this.model.y = y;

  }

  //choosing a color function and drwaing
  pickColor() {
    const colorinput = document.getElementById("colorPicker").value;
    const getColors = document.getElementById("colorPicker");
    getColors.addEventListener('input', function(e){
        mainApp.color(this.value);
        console.log('worked');
    });
    this.model.canvas.addEventListener("mousemove", this.mouseEvent);
    this.model.canvas.addEventListener("mousedown", this.mouseEvent);
    this.model.canvas.addEventListener("mouseup", this.mouseEvent);

    // start the app
    requestAnimationFrame(this.mainLoop);
  }

  //main loop for mouse events and drawing
  mainLoop(time) {
    if (mainApp.model.mouse.b1) {  // is button 1 down
      mainApp.view.draw();
    }


    // save the last known mouse coordinate here not in the mouse event
    mainApp.model.mouse.lastX = mainApp.model.mouse.x;
    mainApp.model.mouse.lastY = mainApp.model.mouse.y;
    requestAnimationFrame(mainApp.mainLoop); // get next frame
  }
  //Function to get Data from the model
  getData(variable) {
    return this.model[variable];
  }

  //Function to set data in the model
  setData(variable, data) {
    this.model[variable] = data;
  }

  //Init the drawing
  init() {
    this.model.canvas = document.getElementById('can');
    this.model.ctx = this.model.canvas.getContext("2d");

    this.model.canvas.width = 1024;
    this.model.canvas.height = 1024;
    this.pickColor();
    this.model.docBox.remove();
    this.view.clicksketch();
    this.view.fixDocs();
  }
}

//The Mainview Class
class MainView {

  //Draw Function for the sketching section
  draw() {
    //Get the Data from the Model
    let ctx = mainApp.getData('ctx');
    let mouse = mainApp.getData('mouse');
    let x = mainApp.getData('x');
    let y = mainApp.getData('y');

    ctx.beginPath();
    ctx.moveTo(mouse.lastX, mouse.lastY);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();

    //Set Data in the Model
    mainApp.setData('ctx', ctx);
  }

  //Erase Function?
  erase() {
    //Getting the Data from the Model
    let ctx = mainApp.getData('ctx');
    let canvas = mainApp.getData('canvas');
    let w = canvas.width;
    let h = canvas.height;

    var m = confirm("Want to clear");
    if (m) {
      ctx.clearRect(0, 0, w, h);
      document.getElementById("canvasimg").style.display = "none";
    }
  }

  //Save function?
  save() {
    document.getElementById("canvasimg").style.border = "2px solid";
    var dataURL = canvas.toDataURL();
    document.getElementById("canvasimg").src = dataURL;
    document.getElementById("canvasimg").style.display = "inline";
  }

  //I have no Idea what this is for
  fixDocs() {
    const docs = mainApp.getData('docs');
    const editor = mainApp.getData('editor');
    const docBox = mainApp.getData('docBox');
    let mainflag = mainApp.getData('mainflag');

    docs.addEventListener('click', function(){
      editor.remove();
      docBox.remove();

      mainflag = true;
      if (mainflag) {
          document.body.appendChild(docBox);
        }
      else {
        document.body.appendChild(editor);
        mainflag = false;
        }
      mainApp.setData('mainflag', mainflag);
      });
  }

  //Probably for switching to sketch?
  clicksketch() {
    let sketch = mainApp.getData('sketch');
    let editor = mainApp.getData('editor');

    sketch.addEventListener("click", function(){
      document.body.appendChild(editor);
      mainApp.init();
    });
  }
}


//Initialize everything
const model = new Model();
const mainView = new MainView();

const mainApp = new Controller(model, mainView);

mainApp.init();
