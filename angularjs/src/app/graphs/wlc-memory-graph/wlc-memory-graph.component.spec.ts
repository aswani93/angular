import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WlcMemoryGraphComponent } from './wlc-memory-graph.component';

describe('WlcMemoryGraphComponent', () => {
  let component: WlcMemoryGraphComponent;
  let fixture: ComponentFixture<WlcMemoryGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WlcMemoryGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WlcMemoryGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
