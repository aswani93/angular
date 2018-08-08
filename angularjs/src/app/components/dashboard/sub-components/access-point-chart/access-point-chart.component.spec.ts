import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessPointChartComponent } from './access-point-chart.component';

describe('AccessPointChartComponent', () => {
  let component: AccessPointChartComponent;
  let fixture: ComponentFixture<AccessPointChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessPointChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessPointChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
