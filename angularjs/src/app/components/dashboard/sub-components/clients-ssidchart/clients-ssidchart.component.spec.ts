import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsSsidchartComponent } from './clients-ssidchart.component';

describe('ClientsSsidchartComponent', () => {
  let component: ClientsSsidchartComponent;
  let fixture: ComponentFixture<ClientsSsidchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientsSsidchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsSsidchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
