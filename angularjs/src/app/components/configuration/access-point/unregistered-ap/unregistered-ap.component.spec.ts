import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnregisteredApComponent } from './unregistered-ap.component';

describe('UnregisteredApComponent', () => {
  let component: UnregisteredApComponent;
  let fixture: ComponentFixture<UnregisteredApComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnregisteredApComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnregisteredApComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
