import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MCQTestPage } from './mcqtest.page';

describe('MCQTestPage', () => {
  let component: MCQTestPage;
  let fixture: ComponentFixture<MCQTestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MCQTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
