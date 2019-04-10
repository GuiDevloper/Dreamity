import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NowhereComponent } from './nowhere.component';

describe('NowhereComponent', () => {
  let component: NowhereComponent;
  let fixture: ComponentFixture<NowhereComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NowhereComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NowhereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
