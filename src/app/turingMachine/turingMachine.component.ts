import { Component, OnInit, Input } from '@angular/core';

enum State {
        NULL, A, B, C, D, E, F, G, H, I, J, ACCEPT, REJECT                        
    }

@Component({
    selector: 'app-home',
    templateUrl: './turingMachine.component.html',
    styleUrls: ['./turingMachine.component.css']
})

export class TuringMachineComponent implements OnInit {

  triangle = {
      x1: 25,
      y1: 200,
      x2: 0,
      y2: 250,
      x3: 50,
      y3: 39
  }

  tape = [];
  tapeLength = 22;
  numTapeCells = 21;
  binaryString: string;
  programState: State;
  instructionCounter: number = 0;
  finalState: string;
  machineState: string;
  machineInstruction: string;
  halt: boolean = false;

  intitialPosition: number = 25;
  currentPosition: number = 0;
  counter: number = 50;
  maxXPosition: number = 950;
  speedX: number = 1;
  positionX: number = 2;
  right: boolean = true;
  writeOne: boolean = false; 

  resultLabel = document.getElementById("stringLabel2") as HTMLLabelElement;

  constructor() {
      this.counter = 0;
      this.intitialPosition = 0;
  }

  beginComputeInput() {        
      this.counter = 0;
      let input = document.getElementById("userString") as HTMLInputElement;     
      this.binaryString = input.value;     
   
      //Disallow any input other than "1" and "0"
      if (this.binaryString.match(/^[0-1]+$/) == null && this.binaryString.trim() !== "") {
          alert("Improper string! Input must be a single binary string");        
          this.binaryString = "";     
          input.value = "";            
          return;
      }
     
      this.ngOnInit();         
      this.initTape();
      this.initProgramState();
      this.readNextTapeCell();   
 }

  ngOnInit() {    
      let canvas = document.getElementById("tCanvas") as HTMLCanvasElement;
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, (canvas.height));

      //Zero-fill tape
      for (let i = 0; i < this.tapeLength; i++) {
          this.tape[i] = "0";
          let verticalLinePosition = i * 50 + 50;        
          ctx.moveTo(verticalLinePosition, 80);
          ctx.lineTo(verticalLinePosition, 175);
          ctx.lineWidth = 2;
          ctx.stroke();

          if (i < this.numTapeCells) {
              //Position of ith tape symbol
              let position = i * 50 + 75;
              ctx.beginPath()
              ctx.arc(position, 130, 20, 0, Math.PI * 2, true);
              ctx.fillStyle = 'white';
              ctx.stroke();
              ctx.arc(position, 130, 15, 0, Math.PI * 2, false);
              ctx.fillStyle = 'black';
              ctx.fill();
          }
      }

      //Draw tape boundary
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
  }

  initTape() {                
      let canvas = document.getElementById("tCanvas") as HTMLCanvasElement;
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, (canvas.height));
      this.binaryString = this.binaryString.trim();     

      for (let i = 0; i < 22; i++) {
          if (i === 0) {
              this.tape[i] = "X";
          } else {
              if (this.binaryString.length !== 0) {
                  if (i <= this.binaryString.length) {
                      this.tape[i] = this.binaryString.charAt(i - 1);
                  } else {
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
        ctx.beginPath();
      }

      //Tape head
      this.currentPosition = 0;
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
  }

  initProgramState() {
      this.programState = State.NULL;
      this.machineState = "";
      this.intitialPosition = 0;
      this.machineInstruction = "";    
      this.finalState = "";     
  }

  run() {
      this.readNextTapeCell();
  }  

  async readNextTapeCell() {     
      await new Promise(resolve => setTimeout(resolve, 200));     
      if (this.programState === State.REJECT || this.programState === State.ACCEPT) {
          return;
      } 
      this.fetchExecuteInstruction();
  }

 //Turing Machine Program Logic
 fetchExecuteInstruction() {      
      this.counter = 0;
      this.instructionCounter++;

      if (this.currentPosition !== 0) {
          this.machineState = State[this.programState];
      }
          
      if (this.currentPosition !== 0) {
      
          switch (this.programState) {

              case State.NULL: {
                  this.programState = State.A;
                  this.machineState = "A";
              }

              case State.A: {
                  if (this.tape[this.currentPosition] === "1") {
                      this.programState = State.B;
                      this.writeNullMoveRight();
                      break;
                  } else if (this.tape[this.currentPosition] === "0") {
                      this.haltExecution(false);
                      break;
                  } else if (this.tape[this.currentPosition] === "-") {
                      this.programState = State.A;
                      this.writeNullMoveRight();
                      break;
                  }
              }

              case State.B: {
                  if (this.tape[this.currentPosition] === "1") {
                      this.programState = State.B;
                      this.write1MoveRight();
                      break;
                  } else if (this.tape[this.currentPosition] === "0") {
                      this.programState = State.B;
                      this.write0MoveRight();
                      break;
                  } else if (this.tape[this.currentPosition] === "-") {
                      this.programState = State.C;
                      this.writeNullMoveLeft();
                      break;
                  }
              }

              case State.C: {
                  if (this.tape[this.currentPosition] === "1") {
                      this.programState = State.D;
                      this.write1MoveLeft();
                      break;
                  } else if (this.tape[this.currentPosition] === "0") {
                      this.programState = State.E;
                      this.write1MoveLeft();
                      break;
                  } else if (this.tape[this.currentPosition] === "-") {                     
                      this.haltExecution(false);
                      break;
                  }
              }

              case State.D: {
                  if (this.tape[this.currentPosition] === "1") {
                      this.programState = State.C;
                      this.write1MoveLeft();
                      break;
                  } else if (this.tape[this.currentPosition] === "0") {
                      this.haltExecution(false); 
                      break;
                  } else if (this.tape[this.currentPosition] === "-") {
                      this.haltExecution(false);
                      break;
                  }
              }

              case State.E: {
                  if (this.tape[this.currentPosition] === "1") {
                      this.haltExecution(false);
                      break;
                  } else if (this.tape[this.currentPosition] === "0") {
                      this.programState = State.F;
                      this.write1MoveLeft();
                      break;
                  } else if (this.tape[this.currentPosition] === "-") {
                      this.haltExecution(false);
                      break;
                  }
              }

            case State.F: {
                if (this.tape[this.currentPosition] === "1") {
                    this.programState = State.H;
                    this.write1MoveLeft();
                    break;
                } else if (this.tape[this.currentPosition] === "0") {
                    this.programState = State.G;
                    this.write0MoveLeft();
                    break;
                } else if (this.tape[this.currentPosition] === "-") {
                    this.programState = State.I;
                    this.writeNullMoveRight();
                    break;
                }
            }

          case State.G: {
                if (this.tape[this.currentPosition] === "1") {
                    this.programState = State.H;
                    this.write1MoveLeft();
                    break;
                } else if (this.tape[this.currentPosition] === "0") {
                    this.programState = State.G;
                    this.write0MoveLeft();
                    break;
                } else if (this.tape[this.currentPosition] === "-") {
                    this.haltExecution(false);
                    break;
                }
          }

          case State.H: {
              if (this.tape[this.currentPosition] === "1") {
                  this.programState = State.H;
                  this.write1MoveLeft();
                  break;
              } else if (this.tape[this.currentPosition] === "0") {
                  this.programState = State.H;
                  this.write0MoveLeft();
                  break;
              } else if (this.tape[this.currentPosition] === "-") {
                  this.programState = State.A;
                  this.writeNullMoveRight();
                  break;
              }
          } 

          case State.I: {
              if (this.tape[this.currentPosition] === "1") {
                  this.programState = State.J;
                  this.write1MoveRight();
                  break;
              } else if (this.tape[this.currentPosition] === "0") {
                  this.haltExecution(false);
                  break;
              } else if (this.tape[this.currentPosition] === "-") {
                  this.haltExecution(true);
                  break;
                }
          }

          case State.J: {
              if (this.tape[this.currentPosition] === "1") {
                  this.programState = State.I;
                  this.write1MoveRight();
                  break;
              } else if (this.tape[this.currentPosition] === "0") {
                  this.haltExecution(false);
                  break;
              } else if (this.tape[this.currentPosition] === "-") {
                  this.haltExecution(false);
                  break;
              }
          }
          
          default: {
              console.log("ERROR!");
              console.log("STATE AT ERROR " + State[this.programState]);
              console.log("TAPE CONTENTS AT " + this.currentPosition + " = " + this.tape[this.currentPosition]);
          }
       }
    } else {
        //Noop instruction: animate tape head movement from "void" onto tape itself
        this.right = true;
        this.moveArrow();
    }    
  }

  
 //Tape head instructions:

  write0MoveRight() {
      this.machineInstruction = "WRITE 0 AND MOVE RIGHT";
      this.tape[this.currentPosition] = "0";
      this.right = true;
      this.moveArrow();
  }

  write0MoveLeft() {
      this.machineInstruction = "WRITE 0 AND MOVE LEFT";
      this.tape[this.currentPosition] = "0"
      this.right = false;
      this.moveArrow();
  }

  write1MoveRight() {
      this.machineInstruction = "WRITE 1 AND MOVE RIGHT";
      this.tape[this.currentPosition] = "1"
      this.right = true;
      this.moveArrow();
  }

  write1MoveLeft() {
      this.machineInstruction = "WRITE 1 AND MOVE LEFT";
      this.tape[this.currentPosition] = "1"
      this.right = false;
      this.moveArrow();
  }

  writeNullMoveRight() {
      this.machineInstruction = "WRITE NULL AND MOVE RIGHT";
      this.tape[this.currentPosition] = "-"
      this.right = true;
      this.moveArrow();
  }

  writeNullMoveLeft() {
      this.machineInstruction = "WRITE NULL AND MOVE LEFT";
      this.tape[this.currentPosition] = "-"
      this.right = false;
      this.moveArrow();
  }

  haltExecution(accept: boolean) {
      let resultLabel = document.getElementById("stringLabel2") as HTMLLabelElement;
      this.machineState = "HALT";
      this.machineInstruction = "---";
      if (accept) {        
          this.programState = State.ACCEPT;
          this.finalState = "ACCEPT!";                 
          resultLabel.style.color = "green";
      } else {         
          this.programState = State.REJECT;
          this.finalState = "REJECT!";         
          resultLabel.style.color = "red";
      }    
  }


  drawArrow(factor) {
      let canvas = document.getElementById("tCanvas") as HTMLCanvasElement;
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, (canvas.height));
      
      this.drawTape();
      this.intitialPosition += factor;
      this.currentPosition = Math.floor(this.intitialPosition / 50);

      ctx.fillStyle = "green";
      ctx.beginPath();     
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
     // this.positionX = this.positionX;  //this.speedX;
      if (this.counter < 50) {
          if (this.right) {
              this.drawArrow(1);
          } else {
              this.drawArrow(-1);
          }
          this.counter++;
          window.requestAnimationFrame(() => this.moveArrow());
      }
      else {
          this.readNextTapeCell();
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

      //redraw current tape symbols and vertical lines
      for (let i = 0; i < 22; i++) {
          let verticalLinePosition = i * 50 + 50;
          ctx.moveTo(verticalLinePosition, 80);
          ctx.lineTo(verticalLinePosition, 175);
          ctx.lineWidth = 2;
          ctx.stroke();

          //Position of ith symbol on tape
          let position = i * 50 + 25;

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

  //Prevent "Enter" from posting back
  handleKeyupEnter(event, value) {
      if (event.code == "Enter") {
          event.preventDefault();
          this.beginComputeInput();
      }
   }
}