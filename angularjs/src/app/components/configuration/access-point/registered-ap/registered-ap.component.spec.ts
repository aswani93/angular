import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredApComponent } from './registered-ap.component';

describe('RegisteredApComponent', () => {
  let component: RegisteredApComponent;
  let fixture: ComponentFixture<RegisteredApComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisteredApComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredApComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
