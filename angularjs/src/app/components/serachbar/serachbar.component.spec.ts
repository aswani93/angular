import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerachbarComponent } from './serachbar.component';

describe('SerachbarComponent', () => {
  let component: SerachbarComponent;
  let fixture: ComponentFixture<SerachbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerachbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerachbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
