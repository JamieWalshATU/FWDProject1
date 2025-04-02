import { Course } from './../course.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonList, IonMenu, IonButtons, IonMenuButton} from '@ionic/angular/standalone';
import { CourseData } from '../course-data.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-course-create',
  templateUrl: './course-create.page.html',
  styleUrls: ['./course-create.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonButtons, IonMenuButton, RouterModule, IonList, IonLabel],
})
export class CourseCreatePage implements OnInit {
  constructor(public courseData: CourseData) {}
  
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

    if (this.courseData.getCourseDetails().some((course: { name: string }) => course.name === this.courseName)) {
      alert('Course already exists!');
      return;
    }

    this.courseData.createCourse(this.courseName, this.courseColor)
      .then(() => {
        // Refresh the courses list after creating a new course
        this.loadCourses();
        // Clear the form
        this.courseName = '';
        this.courseColor = '';
      });
  }

  deleteCourse(id: string): void {
    this.courseData.deleteCourseById(id); // Call the service method
    this.loadCourses(); // Refresh the course list
  }
}
