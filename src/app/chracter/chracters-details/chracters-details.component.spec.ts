import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChractersDetailsComponent } from './chracters-details.component';

describe('ChractersDetailsComponent', () => {
  let component: ChractersDetailsComponent;
  let fixture: ComponentFixture<ChractersDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChractersDetailsComponent]
    });
    fixture = TestBed.createComponent(ChractersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
