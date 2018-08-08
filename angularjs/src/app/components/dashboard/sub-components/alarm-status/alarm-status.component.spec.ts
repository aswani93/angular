import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmStatusComponent } from './alarm-status.component';

describe('AlarmStatusComponent', () => {
  let component: AlarmStatusComponent;
  let fixture: ComponentFixture<AlarmStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
