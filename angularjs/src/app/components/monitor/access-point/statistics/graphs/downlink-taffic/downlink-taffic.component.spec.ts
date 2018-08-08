import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownlinkTafficComponent } from './downlink-taffic.component';

describe('DownlinkTafficComponent', () => {
  let component: DownlinkTafficComponent;
  let fixture: ComponentFixture<DownlinkTafficComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownlinkTafficComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownlinkTafficComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
