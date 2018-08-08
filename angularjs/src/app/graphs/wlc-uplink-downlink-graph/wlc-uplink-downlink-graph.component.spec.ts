import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WlcUplinkDownlinkGraphComponent } from './wlc-uplink-downlink-graph.component';

describe('WlcUplinkDownlinkGraphComponent', () => {
  let component: WlcUplinkDownlinkGraphComponent;
  let fixture: ComponentFixture<WlcUplinkDownlinkGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WlcUplinkDownlinkGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WlcUplinkDownlinkGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
