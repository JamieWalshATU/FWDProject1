import { Component } from '@angular/core';
import { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonTitle, IonToolbar, IonApp, IonList, IonRouterOutlet, IonItem } from '@ionic/angular/standalone';
import { CourseData } from './course-data.service';
import { CommonModule } from '@angular/common';
import { Course } from './course.model';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true, // added standalone flag
  imports: [IonItem, IonRouterOutlet, IonApp, IonContent, IonHeader, IonMenu, IonTitle, IonToolbar, IonList, CommonModule, RouterModule],
})
export class AppComponent {
  constructor(public courseData: CourseData) {}
  courses: Course[] = [];

  ngOnInit(){
    this.courseData.initStorage().then(() => {
      this.courses = this.courseData.getCourseDetails();
      console.log(this.courses);
    }
    ).catch((error) => {
      console.error('Error initializing storage:', error);
    }
    );
  }
}

