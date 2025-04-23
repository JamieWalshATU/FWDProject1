import { Component, inject, OnInit } from '@angular/core';
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
import { ErrorLoggerService } from './core/services/error-logger.service';
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
export class AppComponent implements OnInit {
  constructor(public courseData: CourseData) {}
  // Injects the logger service, this avoids using console logs, and will also log all messages into a downloadable file. This logger is injected across all components and services, so this comment is omitted in the rest of the code.
  private logger = inject(ErrorLoggerService);
  courses: Course[] = [];

  ngOnInit(): void {
    this.logger.log('Session Started!'); // Creates a message in the error logs showing when each session starts,
    
    // Initializes storage and populates the courses array with the data from the service
    this.courseData
      .initStorage()
      .then(() => {
        this.courses = this.courseData.getCourseDetails();
      })
      .catch((error) => {
        const errorMessage = `Error initializing storage: ${String(error)}`;
        this.logger.log(errorMessage);
      });
  }

  deleteCourse(id: string): void {
    this.courseData.deleteCourseById(id);
    this.courses = this.courseData.getCourseDetails();
  }
}
