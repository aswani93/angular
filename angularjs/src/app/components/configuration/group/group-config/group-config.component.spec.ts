import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupConfigComponent } from './group-config.component';

describe('GroupConfigComponent', () => {
  let component: GroupConfigComponent;
  let fixture: ComponentFixture<GroupConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
