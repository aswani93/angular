import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteMaintenanceComponent } from './remote-maintenance.component';

describe('RemoteMaintenanceComponent', () => {
  let component: RemoteMaintenanceComponent;
  let fixture: ComponentFixture<RemoteMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoteMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
