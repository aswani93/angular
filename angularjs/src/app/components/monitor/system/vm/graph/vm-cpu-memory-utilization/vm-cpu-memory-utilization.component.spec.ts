import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmCpuMemoryUtilizationComponent } from './vm-cpu-memory-utilization.component';

describe('VmCpuMemoryUtilizationComponent', () => {
  let component: VmCpuMemoryUtilizationComponent;
  let fixture: ComponentFixture<VmCpuMemoryUtilizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmCpuMemoryUtilizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmCpuMemoryUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
