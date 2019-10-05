import { Component, OnInit, Input } from '@angular/core';

enum State {
  NULL, A, B, C, C2, D, D2, E, E2, F, G, H, ACCEPT, REJECT
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  triangle = {
    x1: 25,
    y1: 200,
    x2: 0,
    y2: 250,
    x3: 50,
    y3: 39
  }

  tape = [];

  intitialPosition: number = 25;
  currentPosition: number = 0;
  counter: number = 50;

  right: boolean = true;
  writeOne: boolean = false;
  halt: boolean = false;

  programState: State;
  instructionCounter: number = 0;
  maxXPosition: number = 950;
  speedX: number = 1;
  positionX: number = 2;

  finalState: string = "";
  machineState: string;
  machineInstruction: string;
  illegalInputString: boolean = false;

  binaryString: string = "";

  constructor() {
    this.counter = 0;
    this.intitialPosition = 0;
  }

  ngOnInit() {

    this.currentPosition = 0;
    this.intitialPosition = 0;
    this.machineInstruction = "";
    this.programState = null;
    this.finalState = "";

    var canvas = document.getElementById("tCanvas") as HTMLCanvasElement;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, (canvas.height));

    for (let i = 0; i < 22; i++) {
        this.tape[i] = "0";

        var verticalLinePosition = i * 50 + 50;
        ctx.moveTo(verticalLinePosition, 80);
        ctx.lineTo(verticalLinePosition, 175);
        ctx.lineWidth = 2;
        ctx.stroke();

      if (i < 21) {
        ctx.beginPath()

        //Position of symbole on ith tape
        var position = i * 50 + 75;

        ctx.arc(position, 130, 20, 0, Math.PI * 2, true);
        ctx.fillStyle = 'white';
        ctx.stroke();
        ctx.arc(position, 130, 15, 0, Math.PI * 2, false);
        ctx.fillStyle = 'black';
        ctx.fill();
     }
   }

    //Draw Tape Boundary
    ctx.fillStyle = "black";
    ctx.moveTo(50, 80);
    ctx.lineTo(1100, 80);
    ctx.lineWidth = 4;

    ctx.moveTo(50, 175);
    ctx.lineTo(1100, 175);
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fill();

    //Draw tape head
    ctx.fillStyle = "green";
    ctx.beginPath();

    ctx.moveTo(this.intitialPosition + this.triangle.x1, this.triangle.y1);
    ctx.lineTo(this.intitialPosition + this.triangle.x2, this.triangle.y2);
    ctx.lineTo(this.intitialPosition + this.triangle.x3 + 0, this.triangle.y2);

    ctx.moveTo(this.intitialPosition + (this.triangle.x1 - 8), this.triangle.y1 + (this.triangle.y2 - this.triangle.y1));
    ctx.lineTo(this.intitialPosition + (this.triangle.x1 - 8), this.triangle.y2 + 50);
    ctx.lineTo(this.intitialPosition + (this.triangle.x1 + 8), this.triangle.y2 + 50);
    ctx.lineTo(this.intitialPosition + (this.triangle.x1 + 8), this.triangle.y2);

    ctx.fill();

    this.currentPosition = 0;
    this.programState = State.NULL;
  }

  initTape() {
    document.getElementById("machineSpan").style.marginLeft = "65px";
    document.getElementById("instructionSpan").style.marginRight = "0px";
    this.machineState = "";

    let canvas = document.getElementById("tCanvas") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, (canvas.height));

    this.binaryString = this.binaryString.trim();

    if (this.binaryString.match(/^[0-1]+$/) == null && this.binaryString.trim() !== "") {
      alert("Illegal string! Input must be a single binary string");
      this.illegalInputString = true;
    }

    for (let i = 0; i < 22; i++) {

      if (i === 0) {
        this.tape[i] = "X";
      } else {
        if (this.binaryString.length !== 0) {
          if (i <= this.binaryString.length) {
            this.tape[i] = this.binaryString.charAt(i - 1);
          }
          else {
            this.tape[i] = "-";
          }
        } else {
          this.tape[i] = "0";
        }
      }

      let verticalLinePosition = i * 50 + 50;

      ctx.moveTo(verticalLinePosition, 80);
      ctx.lineTo(verticalLinePosition, 175);
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath()

    }

    //Null symbol to signify end of tape
    this.tape[22] = "-";


    //Draw Tape Boundary
    ctx.fillStyle = "black";
    ctx.moveTo(50, 80);
    ctx.lineTo(1100, 80);
    ctx.lineWidth = 2;

    ctx.moveTo(50, 175);
    ctx.lineTo(1100, 175);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();

    ctx.moveTo(50, 80);
    ctx.lineTo(50, 175);
    ctx.lineWidth = 2;
    ctx.stroke();

    //Redraw initial position of tape head
    ctx.fillStyle = "green";

    ctx.beginPath();

    ctx.moveTo(this.intitialPosition + this.triangle.x1, this.triangle.y1);
    ctx.lineTo(this.intitialPosition + this.triangle.x2, this.triangle.y2);
    ctx.lineTo(this.intitialPosition + this.triangle.x3 + 0, this.triangle.y2);

    ctx.moveTo(this.intitialPosition + (this.triangle.x1 - 8), this.triangle.y1 + (this.triangle.y2 - this.triangle.y1));
    ctx.lineTo(this.intitialPosition + (this.triangle.x1 - 8), this.triangle.y2 + 50);
    ctx.lineTo(this.intitialPosition + (this.triangle.x1 + 8), this.triangle.y2 + 50);
    ctx.lineTo(this.intitialPosition + (this.triangle.x1 + 8), this.triangle.y2);

    ctx.fill();

    this.currentPosition = 0;
  }


  begin() {

    this.illegalInputString = false;

    this.ngOnInit();

    let canvas = document.getElementById("tCanvas") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d");

    let input = document.getElementById("userString") as HTMLInputElement;
    this.binaryString = input.value;

    this.counter = 0;
    ctx.clearRect(0, 0, canvas.width, (canvas.height));

    this.initTape();

    if (!this.illegalInputString) {
      this.run();
    }
    else {
      this.ngOnInit();
    }
  }

  run() {
    this.pauseWhileReading();
  }

  fetchInstruction() {
    this.counter = 0;

    if (this.currentPosition !== 0) {
      this.machineState = State[this.programState];
    }

    this.instructionCounter++;

    if (this.currentPosition !== 0) {

      switch (this.programState) {
        case State.NULL: {
          this.programState = State.A;
          this.machineState = "A";
        }
        case State.A: {
          if (this.tape[this.currentPosition] === "1") {
            this.programState = State.B;
            this.WriteNullMoveRight();
            break;
          }
          else if (this.tape[this.currentPosition] === "0") {
            this.machineState = "HALT";
            this.programState = State.REJECT;
            this.finalState = "REJECT!";
            var resultLabel = document.getElementById("stringLabel2") as HTMLLabelElement;
            resultLabel.style.color = "red";
            break;
          }
          else if (this.tape[this.currentPosition] === "-") {
            this.programState = State.A;
            this.WriteNullMoveRight();
            break;
          }
        }
        case State.B: {
          if (this.tape[this.currentPosition] === "1") {
            this.programState = State.B;
            this.Write1MoveRight();
            break;
          }
          else if (this.tape[this.currentPosition] === "0") {
            this.programState = State.B;
            this.Write0MoveRight();
            break;
          }
          else if (this.tape[this.currentPosition] === "-") {
            this.programState = State.C;
            this.WriteNullMoveLeft();
            break;
          }
        }
        case State.C: {
          if (this.tape[this.currentPosition] === "1") {
            this.programState = State.C2;
            this.Write1MoveLeft();
            break;
          }
          else if (this.tape[this.currentPosition] === "0") {
            this.programState = State.D;
            this.Write1MoveLeft();
            break;
          }
          else if (this.tape[this.currentPosition] === "-") {
            this.machineState = "HALT";
            this.programState = State.REJECT;
            this.finalState = "REJECT!";
            var resultLabel = document.getElementById("stringLabel2") as HTMLLabelElement;
            resultLabel.style.color = "red";
            break;
          }
        }
        case State.C2: {
          if (this.tape[this.currentPosition] === "1") {
            this.programState = State.C;
            this.Write1MoveLeft();
            break;
          }
          else if (this.tape[this.currentPosition] === "0") {
            this.machineState = "HALT";
            this.programState = State.REJECT;
            this.finalState = "REJECT!";
            var resultLabel = document.getElementById("stringLabel2") as HTMLLabelElement;
            resultLabel.style.color = "red";
            break;
          }
          else if (this.tape[this.currentPosition] === "-") {
            this.programState = State.REJECT;
            this.machineState = "HALT";
            this.finalState = "REJECT!";
            var resultLabel = document.getElementById("stringLabel2") as HTMLLabelElement;
            resultLabel.style.color = "red";
            break;
          }
        }
        case State.D: {
          if (this.tape[this.currentPosition] === "1") {
            this.machineState = "HALT";
            this.programState = State.REJECT;
            this.finalState = "REJECT!";
            var resultLabel = document.getElementById("stringLabel2") as HTMLLabelElement;
            resultLabel.style.color = "red";
            break;
          }
          else if (this.tape[this.currentPosition] === "0") {
            this.programState = State.E;
            this.Write1MoveLeft();
            break;
          }
          else if (this.tape[this.currentPosition] === "-") {
            this.machineState = "HALT";
            this.programState = State.REJECT;
            this.finalState = "REJECT!";
            var resultLabel = document.getElementById("stringLabel2") as HTMLLabelElement;
            resultLabel.style.color = "red";
            break;
          }
        }
        case State.E: {
          if (this.tape[this.currentPosition] === "1") {
            this.programState = State.F;
            this.Write1MoveLeft();
            break;
          }
          else if (this.tape[this.currentPosition] === "0") {
            this.programState = State.E2;
            this.Write0MoveLeft();
            break;
          }
          else if (this.tape[this.currentPosition] === "-") {
            this.programState = State.G;
            this.WriteNullMoveRight();
            break;
          }
        }
        case State.E2: {
          if (this.tape[this.currentPosition] === "1") {
            this.programState = State.F;
            this.Write1MoveLeft();
            break;
          }
          else if (this.tape[this.currentPosition] === "0") {
            this.programState = State.E2;
            this.Write0MoveLeft();
            break;
          }
          else if (this.tape[this.currentPosition] === "-") {
            this.machineState = "HALT";
            this.programState = State.REJECT;
            this.finalState = "REJECT!";
            var resultLabel = document.getElementById("stringLabel2") as HTMLLabelElement;
            resultLabel.style.color = "red";
            break;
          }
        }
        case State.F: {
          if (this.tape[this.currentPosition] === "1") {
            this.programState = State.F;
            this.Write1MoveLeft();
            break;
          }
          else if (this.tape[this.currentPosition] === "0") {
            this.programState = State.F;
            this.Write0MoveLeft();
            break;
          }
          else if (this.tape[this.currentPosition] === "-") {
            this.programState = State.A;
            this.WriteNullMoveRight();
            break;
          }
        }
        case State.G: {
          if (this.tape[this.currentPosition] === "1") {
            this.programState = State.H;
            this.Write1MoveRight();
            break;
          }
          else if (this.tape[this.currentPosition] === "0") {
            this.machineState = "HALT";
            this.programState = State.REJECT;
            this.finalState = "REJECT!";
            var resultLabel = document.getElementById("stringLabel2") as HTMLLabelElement;
            resultLabel.style.color = "red";
            break;
          }
          else if (this.tape[this.currentPosition] === "-") {
            this.machineState = "HALT";
            this.programState = State.ACCEPT;
            var resultLabel = document.getElementById("stringLabel2") as HTMLLabelElement;
            resultLabel.style.color = "green";
            this.finalState = "ACCEPT!";
            break;
          }
        }
        case State.H: {
          if (this.tape[this.currentPosition] === "1") {
            this.programState = State.G;
            this.Write1MoveRight();
            break;
          }
          else if (this.tape[this.currentPosition] === "0") {
            this.machineState = "HALT";
            this.programState = State.REJECT;
            this.finalState = "REJECT!";
            var resultLabel = document.getElementById("stringLabel2") as HTMLLabelElement;
            resultLabel.style.color = "red";
            break;
          }
          else if (this.tape[this.currentPosition] === "-") {
            this.machineState = "HALT";
            this.programState = State.REJECT;
            this.finalState = "REJECT!";
            var resultLabel = document.getElementById("stringLabel2") as HTMLLabelElement;
            resultLabel.style.color = "red";
            break;

          }

        } default: {
          console.log("ERROR!");
          console.log("STATE AT ERROR " + State[this.programState]);
          console.log("TAPE CONTENTS AT " + this.currentPosition + " = " + this.tape[this.currentPosition]);
        }
      }
    } else {
      //First movement is onto the tape
      this.moveRight();
    }

    if (this.machineState === "HALT") {
      //Adjust label margins for final messages
      document.getElementById("machineSpan").style.marginLeft = "45px";
      document.getElementById("instructionSpan").style.marginRight = "18px";
      this.machineInstruction = "---";
    }
  }

  frameSleep() {
    return new Promise(resolve => setTimeout(resolve, 250));
  }

  async pauseWhileReading() {
    await this.frameSleep();
    if (this.programState === State.REJECT || this.programState === State.ACCEPT) {
      return;
    }
    this.fetchInstruction();
  }

  moveRight() {
    this.right = true;
    this.moveArrow();
  }

  moveLeft() {
    this.right = false;
    this.moveArrow();
  }

  Write0MoveRight() {
    this.machineInstruction = "WRITE 0 AND MOVE RIGHT";
    this.tape[this.currentPosition] = "0";
    this.right = true;
    this.moveArrow();
  }

  Write0MoveLeft() {
    this.machineInstruction = "WRITE 0 AND MOVE LEFT";
    this.tape[this.currentPosition] = "0"
    this.right = false;
    this.moveArrow();
  }

  Write1MoveRight() {
    this.machineInstruction = "WRITE 1 AND MOVE RIGHT";
    this.tape[this.currentPosition] = "1"
    this.right = true;
    this.moveArrow();
  }

  Write1MoveLeft() {
    this.machineInstruction = "WRITE 1 AND MOVE LEFT";
    this.tape[this.currentPosition] = "1"
    this.right = false;
    this.moveArrow();
  }

  WriteNullMoveRight() {
    this.machineInstruction = "WRITE NULL AND MOVE RIGHT";
    this.tape[this.currentPosition] = "-"
    this.right = true;
    this.moveArrow();
  }

  WriteNullMoveLeft() {
    this.machineInstruction = "WRITE NULL AND MOVE LEFT";
    this.tape[this.currentPosition] = "-"
    this.right = false;
    this.moveArrow();
  }

  drawArrow(factor) {

    let canvas = document.getElementById("tCanvas") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, (canvas.height));

    this.drawTape();

    this.intitialPosition += factor;

    ctx.fillStyle = "green";
    ctx.beginPath();

    this.currentPosition = Math.floor(this.intitialPosition / 50);
    ctx.moveTo(this.intitialPosition + this.triangle.x1, this.triangle.y1);

    ctx.fillStyle = "green";
    ctx.lineTo(this.intitialPosition + this.triangle.x2, this.triangle.y2);
    ctx.lineTo(this.intitialPosition + this.triangle.x3 + 0, this.triangle.y2);

    ctx.moveTo(this.intitialPosition + (this.triangle.x1 - 8), this.triangle.y1 + (this.triangle.y2 - this.triangle.y1));
    ctx.lineTo(this.intitialPosition + (this.triangle.x1 - 8), this.triangle.y2 + 50);
    ctx.lineTo(this.intitialPosition + (this.triangle.x1 + 8), this.triangle.y2 + 50);
    ctx.lineTo(this.intitialPosition + (this.triangle.x1 + 8), this.triangle.y2);
    ctx.fill();
  }

  moveArrow() {

    this.positionX = this.positionX + this.speedX;

    if (this.counter < 50) {
      if (this.right) {
        this.drawArrow(1);
      }
      else {
        this.drawArrow(-1);
      }
      this.counter++;
      window.requestAnimationFrame(() => this.moveArrow());
    }
    else {
      this.pauseWhileReading();
    }
  }

  drawTape() {
    let canvas = document.getElementById("tCanvas") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d");

    ctx.moveTo(50, 80);
    ctx.lineTo(1100, 80);
    ctx.stroke();
    ctx.moveTo(50, 175);
    ctx.lineTo(1100, 175);
    ctx.stroke();

    //draw current tape symbols and vertical lines
    for (let i = 0; i < 22; i++) {

      var verticalLinePosition = i * 50 + 50;

      ctx.moveTo(verticalLinePosition, 80);
      ctx.lineTo(verticalLinePosition, 175);
      ctx.lineWidth = 2;
      ctx.stroke();

      //Position of symbole on ith tape
      var position = i * 50 + 25;

      if (this.tape[i] === "0") {
        ctx.beginPath()
        ctx.arc(position, 130, 20, 0, Math.PI * 2, true);
        ctx.fillStyle = 'white';
        ctx.stroke();

        ctx.arc(position, 130, 15, 0, Math.PI * 2, false);
        ctx.fillStyle = 'black';
        ctx.fill();
      }
      else if (this.tape[i] === "1") {

        ctx.moveTo(position - 5, 110);
        ctx.lineTo(position - 5, 150);
        ctx.lineTo(position + 5, 150);
        ctx.lineTo(position + 5, 110);

        ctx.fillStyle = 'black';
        ctx.fill();
      }
      else if (this.tape[i] === "-") {
        ctx.clearRect(position - 10, position + 10, 35, 35);
        ctx.fillStyle = 'white';
      }
    }
  }

  //Prevent "Enter" in user input from posting back
  handleKeyupEnter(event, value) {
    if (event.code == "Enter") {
      event.preventDefault();
      this.begin();
    }
  }
}