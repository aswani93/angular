import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WlcInfoChartComponent } from './wlc-info-chart.component';

describe('WlcInfoChartComponent', () => {
  let component: WlcInfoChartComponent;
  let fixture: ComponentFixture<WlcInfoChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WlcInfoChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WlcInfoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
