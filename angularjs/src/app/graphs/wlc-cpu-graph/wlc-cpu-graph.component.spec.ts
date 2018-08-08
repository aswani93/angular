import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WlcCpuGraphComponent } from './wlc-cpu-graph.component';

describe('WlcCpuGraphComponent', () => {
  let component: WlcCpuGraphComponent;
  let fixture: ComponentFixture<WlcCpuGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WlcCpuGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WlcCpuGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
