import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsidDownlinkTraffic5Component } from './ssid-downlink-traffic-5.component';

describe('SsidDownlinkTraffic5Component', () => {
  let component: SsidDownlinkTraffic5Component;
  let fixture: ComponentFixture<SsidDownlinkTraffic5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsidDownlinkTraffic5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsidDownlinkTraffic5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
