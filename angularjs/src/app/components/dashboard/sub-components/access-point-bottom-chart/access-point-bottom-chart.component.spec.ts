import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessPointBottomChartComponent } from './access-point-bottom-chart.component';

describe('AccessPointBottomChartComponent', () => {
  let component: AccessPointBottomChartComponent;
  let fixture: ComponentFixture<AccessPointBottomChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessPointBottomChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessPointBottomChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
