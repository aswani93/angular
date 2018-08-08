import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApChannelInterferenceComponent } from './ap-channel-interference.component';

describe('ApChannelInterferenceComponent', () => {
  let component: ApChannelInterferenceComponent;
  let fixture: ComponentFixture<ApChannelInterferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApChannelInterferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApChannelInterferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
