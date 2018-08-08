import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpuUtilizationChartComponent } from './cpu-utilization-chart.component';

describe('CpuUtilizationChartComponent', () => {
  let component: CpuUtilizationChartComponent;
  let fixture: ComponentFixture<CpuUtilizationChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpuUtilizationChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpuUtilizationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
