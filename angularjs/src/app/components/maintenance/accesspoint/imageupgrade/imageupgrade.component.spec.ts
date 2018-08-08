import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageupgradeComponent } from './imageupgrade.component';

describe('ImageupgradeComponent', () => {
  let component: ImageupgradeComponent;
  let fixture: ComponentFixture<ImageupgradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageupgradeComponent ]
    })
    .compileComponents();
  }));
  

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageupgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
