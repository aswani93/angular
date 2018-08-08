import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RogueApComponent } from './rogue-ap.component';

describe('RogueApComponent', () => {
  let component: RogueApComponent;
  let fixture: ComponentFixture<RogueApComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RogueApComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RogueApComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
