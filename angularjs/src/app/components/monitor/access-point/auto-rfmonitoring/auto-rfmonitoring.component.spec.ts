import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoRfmonitoringComponent } from './auto-rfmonitoring.component';

describe('AutoRfmonitoringComponent', () => {
  let component: AutoRfmonitoringComponent;
  let fixture: ComponentFixture<AutoRfmonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoRfmonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoRfmonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
