import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedundancyComponent } from './redundancy.component';

describe('RedundancyComponent', () => {
  let component: RedundancyComponent;
  let fixture: ComponentFixture<RedundancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedundancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedundancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
