import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopApsComponent } from './top-aps.component';

describe('TopApsComponent', () => {
  let component: TopApsComponent;
  let fixture: ComponentFixture<TopApsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopApsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopApsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
