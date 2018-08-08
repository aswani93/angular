import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {SystemupgradeComponent} from './systemupgrade.component'
describe('SystemupgradeComponent', () => {
  let component: SystemupgradeComponent;
  let fixture: ComponentFixture<SystemupgradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemupgradeComponent ]
    })
    .compileComponents();
  }));
  

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemupgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
