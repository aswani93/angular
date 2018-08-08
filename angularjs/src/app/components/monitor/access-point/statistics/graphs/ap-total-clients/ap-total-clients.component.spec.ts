import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApTotalClientsComponent } from './ap-total-clients.component';

describe('ApTotalClientsComponent', () => {
  let component: ApTotalClientsComponent;
  let fixture: ComponentFixture<ApTotalClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApTotalClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApTotalClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
