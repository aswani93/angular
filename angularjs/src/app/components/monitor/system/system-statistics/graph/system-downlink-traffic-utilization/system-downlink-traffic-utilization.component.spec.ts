import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemDownlinkTrafficUtilizationComponent } from './system-downlink-traffic-utilization.component';

describe('SystemDownlinkTrafficUtilizationComponent', () => {
  let component: SystemDownlinkTrafficUtilizationComponent;
  let fixture: ComponentFixture<SystemDownlinkTrafficUtilizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemDownlinkTrafficUtilizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemDownlinkTrafficUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
