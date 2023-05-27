import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChractersNewComponent } from './chracters-new.component';

describe('ChractersNewComponent', () => {
  let component: ChractersNewComponent;
  let fixture: ComponentFixture<ChractersNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChractersNewComponent]
    });
    fixture = TestBed.createComponent(ChractersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
