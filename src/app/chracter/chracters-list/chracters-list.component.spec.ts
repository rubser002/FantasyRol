import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChractersListComponent } from './chracters-list.component';

describe('ChractersListComponent', () => {
  let component: ChractersListComponent;
  let fixture: ComponentFixture<ChractersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChractersListComponent]
    });
    fixture = TestBed.createComponent(ChractersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
