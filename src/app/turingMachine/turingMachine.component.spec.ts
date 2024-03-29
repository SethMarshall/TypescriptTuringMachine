import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TuringMachineComponent } from './turingMachine.component';

describe('HomeComponent', () => {
  let component: TuringMachineComponent;
  let fixture: ComponentFixture<TuringMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TuringMachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TuringMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
