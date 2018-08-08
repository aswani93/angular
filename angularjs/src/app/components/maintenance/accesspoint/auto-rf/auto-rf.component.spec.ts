import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoRfComponent } from './auto-rf.component';

describe('AutoRfComponent', () => {
  let component: AutoRfComponent;
  let fixture: ComponentFixture<AutoRfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoRfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoRfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
