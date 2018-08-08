import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTopChartsComponent } from './client-top-charts.component';

describe('ClientTopChartsComponent', () => {
  let component: ClientTopChartsComponent;
  let fixture: ComponentFixture<ClientTopChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTopChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTopChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
