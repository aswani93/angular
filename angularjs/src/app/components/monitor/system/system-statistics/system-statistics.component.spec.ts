import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemStatisticsComponent } from './system-statistics.component';

describe('SystemStatisticsComponent', () => {
  let component: SystemStatisticsComponent;
  let fixture: ComponentFixture<SystemStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
