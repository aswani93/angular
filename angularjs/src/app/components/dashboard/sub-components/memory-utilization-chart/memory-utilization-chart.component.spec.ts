import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoryUtilizationChartComponent } from './memory-utilization-chart.component';

describe('MemoryUtilizationChartComponent', () => {
  let component: MemoryUtilizationChartComponent;
  let fixture: ComponentFixture<MemoryUtilizationChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoryUtilizationChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoryUtilizationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
