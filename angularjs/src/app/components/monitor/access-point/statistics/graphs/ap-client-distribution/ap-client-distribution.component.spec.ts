import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApClientDistributionComponent } from './ap-client-distribution.component';

describe('ApClientDistributionComponent', () => {
  let component: ApClientDistributionComponent;
  let fixture: ComponentFixture<ApClientDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApClientDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApClientDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
