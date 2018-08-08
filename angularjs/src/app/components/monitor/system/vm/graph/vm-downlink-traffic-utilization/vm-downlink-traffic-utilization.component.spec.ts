import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmDownlinkTrafficUtilizationComponent } from './vm-downlink-traffic-utilization.component';

describe('VmDownlinkTrafficUtilizationComponent', () => {
  let component: VmDownlinkTrafficUtilizationComponent;
  let fixture: ComponentFixture<VmDownlinkTrafficUtilizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmDownlinkTrafficUtilizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmDownlinkTrafficUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
