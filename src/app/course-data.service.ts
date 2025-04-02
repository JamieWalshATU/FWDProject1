import { Injectable } from '@angular/core';
import { Course, QuestionSet } from './course.model'; 
import { Storage } from '@ionic/storage-angular';
@Injectable({
  providedIn: 'root'
})
export class CourseData {
  
  public courses: Course[] = [];

  constructor(private storage: Storage) { 
    this.initStorage();
  }
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

  getSetById(id: string): QuestionSet | undefined {
    const course = this.courses.find((course) => course.id === id);
    return course?.questionSets.find((set) => set.id === id);
  }

  async getCourseById(id: string): Promise<Course | undefined> {
    const courseData = this.courses.find(course => course.id === id);
    
    if (courseData) {
      // Convert plain object to Course instance
      const course = new Course(courseData.name, courseData.color);
      course.id = courseData.id;
      course.description = courseData.description || '';
      course.questionSets = courseData.questionSets || [];
      return course;
    }
    
    return undefined;
  }

  async updateCourse(updatedCourse: Course): Promise<Course> {
    const index = this.courses.findIndex(course => course.id === updatedCourse.id);
    if (index !== -1) {
      this.courses[index] = updatedCourse;
      console.log('Updated course:', updatedCourse);
      await this.saveToStorage(); 
      return updatedCourse; 
    }
    throw new Error('Course not found');
  }

  async saveToStorage() {
    await this.storage.set('courses', JSON.stringify(this.courses));
  }

  deleteCourseById(id: string): void {
    const courseIndex = this.courses.findIndex(course => course.id === id);
    if (courseIndex !== -1) {
      this.courses.splice(courseIndex, 1); // Remove the course from the array
      this.saveToStorage(); // Persist the changes
      console.log(`Course with ID ${id} deleted.`);
    } else {
      console.error(`Course with ID ${id} not found.`);
    }
  }


}