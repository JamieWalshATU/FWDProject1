import { Component } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonMenu,
  IonTitle,
  IonToolbar,
  IonApp,
  IonList,
  IonRouterOutlet,
  IonItem,
} from '@ionic/angular/standalone';
import { CourseData } from './core/services/course-data.service';
import { CommonModule } from '@angular/common';
import { Course } from './core/services/storage/models/course.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true, 
  imports: [
    IonItem,
    IonRouterOutlet,
    IonApp,
    IonContent,
    IonHeader,
    IonMenu,
    IonTitle,
    IonToolbar,
    IonList,
    CommonModule,
    RouterModule,
  ],
})
export class AppComponent {
  constructor(public courseData: CourseData) {}
  courses: Course[] = [];

  async ngOnInit(): Promise<void> {
    try {
      // Initializes storage
      await this.courseData.initStorage();
      // Load sidebar courses
      await this.loadCourses();
      // Refresh sidebar when courses change
      this.courseData.coursesChanged$.subscribe(() => this.loadCourses());
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  /**
   * Load current list of courses from storage
   */
  async loadCourses(): Promise<void> {
    this.courses = await this.courseData.getCourseDetails();
  }

  async deleteCourse(id: string): Promise<void> {
    await this.courseData.deleteCourseById(id);
    this.courses = await this.courseData.getCourseDetails();
  }
}
