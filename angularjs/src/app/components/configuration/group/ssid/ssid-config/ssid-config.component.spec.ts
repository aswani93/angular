import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsidConfigComponent } from './ssid-config.component';

describe('SsidConfigComponent', () => {
  let component: SsidConfigComponent;
  let fixture: ComponentFixture<SsidConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsidConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsidConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
