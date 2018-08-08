import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmsSnmpComponent } from './ems-snmp.component';

describe('EmsSnmpComponent', () => {
  let component: EmsSnmpComponent;
  let fixture: ComponentFixture<EmsSnmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmsSnmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmsSnmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
