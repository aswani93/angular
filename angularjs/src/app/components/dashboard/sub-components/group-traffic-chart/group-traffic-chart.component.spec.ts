import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTrafficChartComponent } from './group-traffic-chart.component';

describe('GroupTrafficChartComponent', () => {
  let component: GroupTrafficChartComponent;
  let fixture: ComponentFixture<GroupTrafficChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupTrafficChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTrafficChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
