import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirQualityDetailsComponent } from './air-quality-details.component';

describe('AirQualityDetailsComponent', () => {
  let component: AirQualityDetailsComponent;
  let fixture: ComponentFixture<AirQualityDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirQualityDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirQualityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
