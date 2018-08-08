import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmsettingComponent } from './alarmsetting.component';

describe('AlarmsettingComponent', () => {
  let component: AlarmsettingComponent;
  let fixture: ComponentFixture<AlarmsettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmsettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
