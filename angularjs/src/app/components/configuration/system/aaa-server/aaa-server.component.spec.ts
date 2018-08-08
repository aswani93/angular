import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AaaServerComponent } from './aaa-server.component';

describe('AaaServerComponent', () => {
  let component: AaaServerComponent;
  let fixture: ComponentFixture<AaaServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AaaServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AaaServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
