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
import { Course } from './core/models/course.model';
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

  ngOnInit() {
    
    // Initializes storage and populates the courses array with the data from the service
    this.courseData
      .initStorage()
      .then(() => {
        this.courses = this.courseData.getCourseDetails();
      })
      .catch((error) => {
        console.error('Error initializing storage:', error);
        // **Add logic if promise fails**
      });
  }

  deleteCourse(id: string): void {
    this.courseData.deleteCourseById(id); 
    this.courses = this.courseData.getCourseDetails(); 
  }
}
