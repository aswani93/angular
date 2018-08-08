import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RogueApmonitoringComponent } from './rogue-apmonitoring.component';

describe('RogueApmonitoringComponent', () => {
  let component: RogueApmonitoringComponent;
  let fixture: ComponentFixture<RogueApmonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RogueApmonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RogueApmonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
