import { Injectable } from '@angular/core';
import { Course, QuestionSet } from '../models/course.model';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class CourseData {
  public courses: Course[] = [];
  private STORAGE_KEY = 'courses';
  private initialized = false;

  constructor(private storage: Storage) {}
  
  /**
   * Initialize storage and load courses
   * This method is idempotent and can be called multiple times
   */
  async initStorage(): Promise<void> {
    if (this.initialized) return;
    
    try {
      await this.storage.create();
      const storedCourses = await this.storage.get(this.STORAGE_KEY);
      if (storedCourses) {
        this.courses = JSON.parse(storedCourses);
      }
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing storage:', error);
      throw new Error(`Failed to initialize storage: ${error}`);
    }
  }

  /**
   * Create a new course
   */
  async createCourse(name: string, color: string): Promise<Course> {
    await this.initStorage();
    
    try {
      const course = new Course(name, color);
      this.courses.push(course);
      await this.saveToStorage();
      return course;
    } catch (error) {
      console.error('Error creating course:', error);
      throw new Error(`Failed to create course: ${error}`);
    }
  }

  /**
   * Get all courses
   */
  async getCourseDetails(): Promise<Course[]> {
    await this.initStorage();
    return this.courses;
  }

  /**
   * Get question set by id
   */
  async getSetById(courseId: string, setId: string): Promise<QuestionSet | undefined> {
    await this.initStorage();
    
    const course = this.courses.find((course) => course.id === courseId);
    return course?.questionSets.find((set) => set.id === setId);
  }

  /**
   * Get course color
   */
  async getCourseColor(id: string): Promise<string | null> {
    await this.initStorage();
    
    const course = this.courses.find((course) => course.id === id);
    return course ? course.color : null;
  }

  /**
   * Get course by id
   */
  async getCourseById(id: string): Promise<Course | undefined> {
    await this.initStorage();
    
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

  /**
   * Update an existing course
   */
  async updateCourse(updatedCourse: Course): Promise<Course> {
    await this.initStorage();
    
    try {
      const index = this.courses.findIndex(
        (course) => course.id === updatedCourse.id,
      );
      
      if (index !== -1) {
        this.courses[index] = updatedCourse;
        await this.saveToStorage();
        return updatedCourse;
      }
      
      throw new Error('Course not found');
    } catch (error) {
      console.error('Error updating course:', error);
      throw new Error(`Failed to update course: ${error}`);
    }
  }

  /**
   * Save courses to storage
   */
  async saveToStorage(): Promise<void> {
    try {
      await this.storage.set(this.STORAGE_KEY, JSON.stringify(this.courses));
    } catch (error) {
      console.error('Error saving to storage:', error);
      throw new Error(`Failed to save to storage: ${error}`);
    }
  }

  /**
   * Delete a course by id
   */
  async deleteCourseById(id: string): Promise<void> {
    await this.initStorage();
    
    try {
      const courseIndex = this.courses.findIndex((course) => course.id === id);
      
      if (courseIndex !== -1) {
        this.courses.splice(courseIndex, 1);
        await this.saveToStorage();
      } else {
        console.warn(`Course with ID ${id} not found.`);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      throw new Error(`Failed to delete course: ${error}`);
    }
  }
}
