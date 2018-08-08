import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApStatusChartComponent } from './ap-status-chart.component';

describe('ApStatusChartComponent', () => {
  let component: ApStatusChartComponent;
  let fixture: ComponentFixture<ApStatusChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApStatusChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApStatusChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
