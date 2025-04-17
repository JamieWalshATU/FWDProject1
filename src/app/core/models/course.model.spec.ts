import { Course } from './core/models/course.model';

describe('Course', () => {
  it('should create an instance', () => {
    expect(new Course()).toBeTruthy();
  });
});
