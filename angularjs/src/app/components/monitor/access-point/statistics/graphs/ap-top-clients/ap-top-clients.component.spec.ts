import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApTopClientsComponent } from './ap-top-clients.component';

describe('ApTopClientsComponent', () => {
  let component: ApTopClientsComponent;
  let fixture: ComponentFixture<ApTopClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApTopClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApTopClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
