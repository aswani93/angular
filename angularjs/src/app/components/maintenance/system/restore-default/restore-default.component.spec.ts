import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoreDefaultComponent } from './restore-default.component';

describe('RestoreDefaultComponent', () => {
  let component: RestoreDefaultComponent;
  let fixture: ComponentFixture<RestoreDefaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestoreDefaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
