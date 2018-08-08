import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineApComponent } from './online-ap.component';

describe('OnlineApComponent', () => {
  let component: OnlineApComponent;
  let fixture: ComponentFixture<OnlineApComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineApComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineApComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
