import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpconfigComponent } from './ipconfig.component';

describe('IpconfigComponent', () => {
  let component: IpconfigComponent;
  let fixture: ComponentFixture<IpconfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpconfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
