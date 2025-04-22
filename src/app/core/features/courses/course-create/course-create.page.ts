import { Course } from '../../../services/storage/models/course.model';
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

  async ngOnInit(): Promise<void> {
    await this.loadCourses();
  }

  async loadCourses(): Promise<void> {
    this.courses = await this.courseData.getCourseDetails();
  }

  async generateCourse(): Promise<void> {
    if (this.courseName === '' || this.courseColor === '') {
      alert('Please fill in all fields');
      return;
    }

    const existing = await this.courseData.getCourseDetails();
    if (existing.some(course => course.name === this.courseName)) {
      alert('Course already exists!');
      return;
    }
    // Creates a new course with the verified data
    await this.courseData.createCourse(this.courseName, this.courseColor);
    await this.loadCourses();
    this.courseName = '';
    this.courseColor = '';
  }

  async deleteCourse(id: string): Promise<void> {
    await this.courseData.deleteCourseById(id);
    await this.loadCourses();
  }
}
