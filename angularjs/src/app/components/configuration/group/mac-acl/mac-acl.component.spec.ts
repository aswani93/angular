import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MacAclComponent } from './mac-acl.component';

describe('MacAclComponent', () => {
  let component: MacAclComponent;
  let fixture: ComponentFixture<MacAclComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MacAclComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MacAclComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
