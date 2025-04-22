import { Injectable } from '@angular/core';
import { Course, QuestionSet } from './storage/models/course.model';
import { CourseRepository } from './storage/repositories/course.repository';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseData {
  /** Emits when the courses list is modified */
  private coursesChanged = new Subject<void>();
  /** Observable to subscribe for course list changes */
  public coursesChanged$: Observable<void> = this.coursesChanged.asObservable();

  constructor(private courseRepository: CourseRepository) {}

  // no initialization needed; repository handles storage

  async createCourse(name: string, color: string): Promise<Course> {
    const course = await this.courseRepository.create({ name, color });
    this.coursesChanged.next();
    return course;
  }

  async getCourseDetails(): Promise<Course[]> {
    return this.courseRepository.getAll();
  }

  async getSetById(courseId: string, setId: string): Promise<QuestionSet | undefined> {
    return this.courseRepository.getSetById(courseId, setId);
  }

  async getCourseColor(id: string): Promise<string | null> {
    return this.courseRepository.getCourseColor(id);
  }

  async getCourseById(id: string): Promise<Course | undefined> {
    return this.courseRepository.getById(id);
  }

  async updateCourse(updatedCourse: Course): Promise<Course> {
    return this.courseRepository.update(updatedCourse);
  }

  async deleteCourseById(id: string): Promise<void> {
    await this.courseRepository.delete(id);
    this.coursesChanged.next();
  }

  /**
   * Initialize storage for courses repository
   */
  async initStorage(): Promise<void> {
    return this.courseRepository.initializeStorage();
  }
}
