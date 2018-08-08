import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsGroupChartComponent } from './clients-group-chart.component';

describe('ClientsGroupChartComponent', () => {
  let component: ClientsGroupChartComponent;
  let fixture: ComponentFixture<ClientsGroupChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientsGroupChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsGroupChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
