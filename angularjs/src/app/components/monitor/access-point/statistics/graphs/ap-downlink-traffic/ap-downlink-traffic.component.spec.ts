import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApDownlinkTrafficComponent } from './ap-downlink-traffic.component';

describe('ApDownlinkTrafficComponent', () => {
  let component: ApDownlinkTrafficComponent;
  let fixture: ComponentFixture<ApDownlinkTrafficComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApDownlinkTrafficComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApDownlinkTrafficComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
