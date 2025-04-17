import { Course } from '../../../models/course.model';
import { Component, OnInit, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { CourseData } from '../../../services/course-data.service';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';

@Component({
  selector: 'app-course-create',
  templateUrl: './course-create.page.html',
  styleUrls: ['./course-create.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    IonItem,
    IonButtons,
    IonMenuButton,
    RouterModule,
    IonList,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonIcon,
    DashboardComponent,
  ],
})
export class CourseCreatePage implements OnInit {
  constructor(
    public courseData: CourseData,
    public routerModule: RouterModule,
  ) {}

  courses: Course[] = [];

  courseName: string = '';
  courseColor: string = '';

  ngOnInit(): void {
    this.loadCourses();
  }
  loadCourses() {
    this.courses = this.courseData.getCourseDetails();
  }

  generateCourse() {
    if (this.courseName === '' || this.courseColor === '') {
      alert('Please fill in all fields');
      return;
    }

    if (
      this.courseData
        .getCourseDetails()
        // Checks if the course exists in the Array by comparing the name,
        .some((course: { name: string }) => course.name === this.courseName)
    ) {
      alert('Course already exists!');
      return;
    }
    // Creates a new course with the verified data
    this.courseData.createCourse(this.courseName, this.courseColor).then(() => {

      //Refresh the course list after creation and resets the form
      this.loadCourses();
      this.courseName = '';
      this.courseColor = '';
    });
  }

  deleteCourse(id: string): void {
    this.courseData.deleteCourseById(id); 
    this.loadCourses(); 
  }
}
