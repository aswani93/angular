import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApModelComponent } from './ap-model.component';

describe('ApModelComponent', () => {
  let component: ApModelComponent;
  let fixture: ComponentFixture<ApModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
