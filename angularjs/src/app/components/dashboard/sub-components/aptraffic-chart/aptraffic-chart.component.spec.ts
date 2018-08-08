import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AptrafficChartComponent } from './aptraffic-chart.component';

describe('AptrafficChartComponent', () => {
  let component: AptrafficChartComponent;
  let fixture: ComponentFixture<AptrafficChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AptrafficChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AptrafficChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
