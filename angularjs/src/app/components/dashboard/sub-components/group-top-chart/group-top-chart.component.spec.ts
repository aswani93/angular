import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTopChartComponent } from './group-top-chart.component';

describe('GroupTopChartComponent', () => {
  let component: GroupTopChartComponent;
  let fixture: ComponentFixture<GroupTopChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupTopChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTopChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
