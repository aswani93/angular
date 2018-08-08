import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApCpuMemoryUtilizationComponent } from './ap-cpu-memory-utilization.component';

describe('ApCpuMemoryUtilizationComponent', () => {
  let component: ApCpuMemoryUtilizationComponent;
  let fixture: ComponentFixture<ApCpuMemoryUtilizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApCpuMemoryUtilizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApCpuMemoryUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
