import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseCreatePage } from './course-create.page';

describe('CourseCreatePage', () => {
  let component: CourseCreatePage;
  let fixture: ComponentFixture<CourseCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
