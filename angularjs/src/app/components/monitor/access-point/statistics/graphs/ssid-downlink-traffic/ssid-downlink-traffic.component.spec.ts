import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsidDownlinkTrafficComponent } from './ssid-downlink-traffic.component';

describe('SsidDownlinkTrafficComponent', () => {
  let component: SsidDownlinkTrafficComponent;
  let fixture: ComponentFixture<SsidDownlinkTrafficComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsidDownlinkTrafficComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsidDownlinkTrafficComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
