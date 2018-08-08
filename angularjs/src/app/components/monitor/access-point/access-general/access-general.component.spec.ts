import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessGeneralComponent } from './access-general.component';

describe('AccessGeneralComponent', () => {
  let component: AccessGeneralComponent;
  let fixture: ComponentFixture<AccessGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
