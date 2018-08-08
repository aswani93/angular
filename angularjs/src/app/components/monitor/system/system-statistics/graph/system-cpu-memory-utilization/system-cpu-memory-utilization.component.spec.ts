import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemCpuMemoryUtilizationComponent } from './system-cpu-memory-utilization.component';

describe('SystemCpuMemoryUtilizationComponent', () => {
  let component: SystemCpuMemoryUtilizationComponent;
  let fixture: ComponentFixture<SystemCpuMemoryUtilizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemCpuMemoryUtilizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemCpuMemoryUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
