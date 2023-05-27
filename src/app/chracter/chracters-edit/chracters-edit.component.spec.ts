import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChractersEditComponent } from './chracters-edit.component';

describe('ChractersEditComponent', () => {
  let component: ChractersEditComponent;
  let fixture: ComponentFixture<ChractersEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChractersEditComponent]
    });
    fixture = TestBed.createComponent(ChractersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
