import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupBottomChartComponent } from './group-bottom-chart.component';

describe('GroupBottomChartComponent', () => {
  let component: GroupBottomChartComponent;
  let fixture: ComponentFixture<GroupBottomChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupBottomChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupBottomChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
