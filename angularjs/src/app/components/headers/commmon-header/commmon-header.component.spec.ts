import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommmonHeaderComponent } from './commmon-header.component';

describe('CommmonHeaderComponent', () => {
  let component: CommmonHeaderComponent;
  let fixture: ComponentFixture<CommmonHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommmonHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommmonHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
