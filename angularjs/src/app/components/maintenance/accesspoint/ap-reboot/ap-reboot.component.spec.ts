import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApRebootComponent } from './ap-reboot.component';

describe('ApRebootComponent', () => {
  let component: ApRebootComponent;
  let fixture: ComponentFixture<ApRebootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApRebootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApRebootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
