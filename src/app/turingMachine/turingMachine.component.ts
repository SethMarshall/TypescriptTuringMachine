import { Component, OnInit } from '@angular/core';

//Turing MAchine logical states
enum State {
        NULL, A, B, C, D, E, F, G, H, I, J, ACCEPT, REJECT                        
    }

@Component({
    selector: 'app-home',
    templateUrl: './turingMachine.component.html',
    styleUrls: ['./turingMachine.component.css']
})

export class TuringMachineComponent implements OnInit {
  //Turing Machine related fields
  tape = [];
  tapeLength = 22;
  numTapeCells = 21;
  binaryString: string;
  programState: State;
  instructionCounter: number = 0;
  finalState: string;
  machineState: string;
  machineInstruction: string;

  //Animation related fields
  intitialPosition: number = 25;
  currentPosition: number = 0;
  counter: number = 50;
  right: boolean = true;
  triangle = {
    x1: 25,
    y1: 200,
    x2: 0,
    y2: 250,
    x3: 50,
    y3: 39
}

  constructor() {     
      //draw tape head to left of tape bounadries on application load
      this.intitialPosition = 0;
  }

  beginComputeInput() {        
      this.counter = 0;
      let input = document.getElementById("userString") as HTMLInputElement;     
      this.binaryString = input.value;     
   
      //Disallow any input other than "1" or "0"
      if (this.binaryString.match(/^[0-1]+$/) == null && this.binaryString.trim() !== "") {
          alert("Improper string! Input must be a binary string of 1s and 0s");        
          this.binaryString, input.value = "";                    
          return;
      }
     
      this.ngOnInit();           
      this.initProgramState();
      this.storeInput();
      this.readNextTapeCell();   
 }


  initProgramState() {
      this.programState = State.NULL;
      this.machineState = "";
      this.intitialPosition = 0;
      this.currentPosition = 0;
      this.machineInstruction = "";    
      this.finalState = "";     
  }


  storeInput() {
      //load user input onto tape
      for (let i = 0; i < this.tapeLength; i++) {
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
      }
      this.tape[this.tapeLength] = "-";
   }

  async readNextTapeCell() {    
      //pause to visually simulate read-write operation 
      await new Promise(resolve => setTimeout(resolve, 200));     
      if (this.programState === State.REJECT || this.programState === State.ACCEPT) {
          return;
      } 
      this.fetchExecuteInstruction();
  }

 //Turing Machine state logic
 fetchExecuteInstruction() {      
      this.counter = 0;
   
      if (this.currentPosition !== 0) {
          this.machineState = State[this.programState];
      }
          
      if (this.currentPosition !== 0) {
      
          switch (this.programState) {

             //move from "void" to first genuine state
              case State.NULL: {
                  this.programState = State.A;
                  this.machineState = "A";
              }

              case State.A: {
                  if (this.tape[this.currentPosition] === "1") {
                      this.programState = State.B;                    
                      this.writeMove("NULL", true);
                      break;
                  } else if (this.tape[this.currentPosition] === "0") {
                      this.haltExecution(false);
                      break;
                  } else if (this.tape[this.currentPosition] === "-") {
                      this.programState = State.A;                    
                      this.writeMove("NULL", true);
                      break;
                  }
              }

              case State.B: {
                  if (this.tape[this.currentPosition] === "1") {
                      this.programState = State.B;                     
                      this.writeMove("1", true);
                      break;
                  } else if (this.tape[this.currentPosition] === "0") {
                      this.programState = State.B;                     
                      this.writeMove("0", true);
                      break;
                  } else if (this.tape[this.currentPosition] === "-") {
                      this.programState = State.C;                     
                      this.writeMove("NULL", false);
                      break;
                  }
              }

              case State.C: {
                  if (this.tape[this.currentPosition] === "1") {
                      this.programState = State.D;                    
                      this.writeMove("1", false);
                      break;
                  } else if (this.tape[this.currentPosition] === "0") {
                      this.programState = State.E;                    
                      this.writeMove("1", false);
                      break;
                  } else if (this.tape[this.currentPosition] === "-") {                     
                      this.haltExecution(false);
                      break;
                  }
              }

              case State.D: {
                  if (this.tape[this.currentPosition] === "1") {
                      this.programState = State.C;                     
                      this.writeMove("1", false);
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
                      this.writeMove("1", false);
                      break;
                  } else if (this.tape[this.currentPosition] === "-") {
                      this.haltExecution(false);
                      break;
                  }
              }

            case State.F: {
                if (this.tape[this.currentPosition] === "1") {
                    this.programState = State.H;                   
                    this.writeMove("1", false);
                    break;
                } else if (this.tape[this.currentPosition] === "0") {
                    this.programState = State.G;                   
                    this.writeMove("0", false);
                    break;
                } else if (this.tape[this.currentPosition] === "-") {
                    this.programState = State.I;                   
                    this.writeMove("NULL", true);
                    break;
                }
            }

          case State.G: {
                if (this.tape[this.currentPosition] === "1") {
                    this.programState = State.H;                   
                    this.writeMove("1", false);
                    break;
                } else if (this.tape[this.currentPosition] === "0") {
                    this.programState = State.G;                   
                    this.writeMove("0", false);
                    break;
                } else if (this.tape[this.currentPosition] === "-") {
                    this.haltExecution(false);
                    break;
                }
          }

          case State.H: {
              if (this.tape[this.currentPosition] === "1") {
                  this.programState = State.H;                  
                  this.writeMove("1", false);
                  break;
              } else if (this.tape[this.currentPosition] === "0") {
                  this.programState = State.H;                
                  this.writeMove("0", false);
                  break;
              } else if (this.tape[this.currentPosition] === "-") {
                  this.programState = State.A;                
                  this.writeMove("NULL", true);
                  break;
              }
          } 

          case State.I: {
              if (this.tape[this.currentPosition] === "1") {
                  this.programState = State.J;                
                  this.writeMove("1", true);
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
                  this.writeMove("1", true);
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
              alert(`ERROR ocurred while in state ${State[this.programState]} at cell ${this.tape[this.currentPosition]}`);          
          }
       }
    } else {
        //Noop: animate tape head movement from "void" onto tape itself
        this.right = true;
        this.moveArrow();
    }    
  }

  
 //Tape head instruction functions:

  writeMove(symbol: string, moveright: boolean) {    
      let direction = "";      
      if (moveright) {          
          direction = "RIGHT";
          this.right = true;
      } else {
          direction = "LEFT";
          this.right = false;
      }      

      this.machineInstruction = `WRITE ${symbol} AND MOVE ${direction}`;            
      if (symbol == "NULL") {
          symbol = "-";    
      }      

      this.tape[this.currentPosition] = symbol;
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



//Animation related functions:

    ngOnInit() {    
        let canvas = document.getElementById("tCanvas") as HTMLCanvasElement;
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, (canvas.height));
    
        //Draw tape boundary
        ctx.fillStyle = "black";
        ctx.lineWidth = 4;
        ctx.moveTo(50, 80);
        ctx.lineTo(1100, 80);        
        ctx.moveTo(50, 175);
        ctx.lineTo(1100, 175);        
        ctx.stroke();
        ctx.fill();

        //Draw cell boundaries
        for (let i = 0; i < this.tapeLength; i++) {
            this.tape[i] = "0";
            let verticalLinePosition = i * 50 + 50;        
            ctx.lineWidth = 2;
            ctx.moveTo(verticalLinePosition, 80);
            ctx.lineTo(verticalLinePosition, 175);           
            ctx.stroke();     
        }

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

  repaintTapeHead(factor) {
      let canvas = document.getElementById("tCanvas") as HTMLCanvasElement;
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, (canvas.height));      
      
      this.repaintTape();
      this.intitialPosition += factor;
      this.currentPosition = Math.floor(this.intitialPosition / 50);

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

  moveArrow() {    
      if (this.counter < 50) {
          if (this.right) {
              this.repaintTapeHead(1);
          } else {
              this.repaintTapeHead(-1);
          }
          this.counter++;
          window.requestAnimationFrame(() => this.moveArrow());
      }
      else {
          this.readNextTapeCell();
      }
  }

  repaintTape() {
      let canvas = document.getElementById("tCanvas") as HTMLCanvasElement;
      let ctx = canvas.getContext("2d");
      ctx.moveTo(50, 80);
      ctx.lineTo(1100, 80);
      ctx.stroke();
      ctx.moveTo(50, 175);
      ctx.lineTo(1100, 175);
      ctx.stroke();

      //redraw current tape symbols and vertical lines
      for (let i = 0; i < this.tapeLength; i++) {
          let verticalLinePosition = i * 50 + 50;
          ctx.lineWidth = 2;
          ctx.moveTo(verticalLinePosition, 80);
          ctx.lineTo(verticalLinePosition, 175);         
          ctx.stroke();

          //get position of ith symbol on tape
          let position = i * 50 + 25;

          //draw "0" or "1"
          if (this.tape[i] === "0") {
              ctx.beginPath()
              ctx.arc(position, 130, 20, 0, Math.PI * 2, true);
              ctx.fillStyle = 'white';
              ctx.stroke();
              ctx.arc(position, 130, 15, 0, Math.PI * 2, false);
              ctx.fillStyle = 'black';
              ctx.fill();
          } else if (this.tape[i] === "1") {
              ctx.moveTo(position - 5, 110);
              ctx.lineTo(position - 5, 150);
              ctx.lineTo(position + 5, 150);
              ctx.lineTo(position + 5, 110);
              ctx.fillStyle = 'black';
              ctx.fill();
          } else if (this.tape[i] === "-") {
              ctx.clearRect(position - 10, position + 10, 35, 35);
              ctx.fillStyle = 'white';
          }
       }
  }

  //Prevent "Enter" key from submitting posting back
  handleKeyupEnter(event, value) {
      if (event.code == "Enter") {
          event.preventDefault();
          this.beginComputeInput();
      }
   }
}