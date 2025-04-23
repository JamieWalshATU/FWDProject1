import { Injectable, inject } from '@angular/core';
import { Course, QuestionSet } from '../models/course.model';
import { Storage } from '@ionic/storage-angular';
import { ErrorLoggerService } from './error-logger.service';

@Injectable({
  providedIn: 'root',
})
export class CourseData {
  public courses: Course[] = [];
  private logger = inject(ErrorLoggerService);

  constructor(private storage: Storage) {
    this.initStorage();
  }
  //Retrieves JSON data from storage and parses it into a Course object. This allows saving and loading all data in a single function call.

  async initStorage() {
    await this.storage.create();
    const storedCourses = await this.storage.get('courses');
    if (storedCourses) {
      this.courses = JSON.parse(storedCourses);
    }
  }
  async createCourse(name: string, color: string) {
    this.courses.push(new Course(name, color));
    await this.saveToStorage();
  }

  getCourseDetails() {
    return this.courses;
  }

  getSetById(courseId: string, setId: string): QuestionSet | undefined {
    const course = this.courses.find((course) => course.id === courseId);
    return course?.questionSets.find((set) => set.id === setId);
  }

  getCourseColor(id: string): string | null {
    const course = this.courses.find((course) => course.id === id);
    return course ? course.color : null;
  }
  // Creates a reference to the course object in the storage, and parses the data into a Course object.
  async getCourseById(id: string): Promise<Course | undefined> {
    const courseData = this.courses.find((course) => course.id === id);

    if (courseData) {
      const course = new Course(courseData.name, courseData.color);
      course.id = courseData.id;
      course.description = courseData.description || '';
      course.questionSets = courseData.questionSets || [];
      course.imageUrl = courseData.imageUrl || '';
      return course;
    }

    return undefined;
  }

  async updateCourse(updatedCourse: Course): Promise<Course> {
    const index = this.courses.findIndex(
      (course) => course.id === updatedCourse.id,
    );
    if (index !== -1) {
      this.courses[index] = updatedCourse;
      this.logger.log('Updated course: ' + JSON.stringify(updatedCourse));
      await this.saveToStorage();
      return updatedCourse;
    }
    throw new Error('Course not found');
  }
  // Saves the courses array to storage in JSON format.
  async saveToStorage() {
    await this.storage.set('courses', JSON.stringify(this.courses));
  }

  deleteCourseById(id: string): void {
    const courseIndex = this.courses.findIndex((course) => course.id === id);
    if (courseIndex !== -1) {
      this.courses.splice(courseIndex, 1);
      this.saveToStorage();
    } else {
      this.logger.handleError(new Error(`Course with ID ${id} not found.`));
    }
  }
}
