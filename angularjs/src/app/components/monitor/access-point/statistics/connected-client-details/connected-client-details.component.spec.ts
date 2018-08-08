import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedClientDetailsComponent } from './connected-client-details.component';

describe('ConnectedClientDetailsComponent', () => {
  let component: ConnectedClientDetailsComponent;
  let fixture: ComponentFixture<ConnectedClientDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectedClientDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectedClientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
