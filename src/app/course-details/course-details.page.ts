import { CourseData } from './../course-data.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonList, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonMenuButton } from '@ionic/angular/standalone';
import { Course, QuestionSet } from '../course.model';
import { PdfParserComponent } from '../pdf-parser/pdf-parser.component';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.page.html',
  styleUrls: ['./course-details.page.scss'],
  standalone: true,
  imports: [IonButton, IonList, IonLabel, IonItem, IonCardContent, IonCardTitle, IonCardHeader, IonCard,  IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterModule, IonButtons, IonMenuButton, PdfParserComponent],
})
export class CourseDetailsPage implements OnInit {
  course: Course| undefined;
  courseId: string | null = null;
  courseColor: string | null = null;
  selectedQuestionSet: QuestionSet | null = null;
  constructor(
    private route: ActivatedRoute,
    private courseData: CourseData,
  ) {}

  ngOnInit(): void {
    // Get the route parameter
    this.route.paramMap.subscribe((params) => {
      // Reset selected question set when route changes
      this.selectedQuestionSet = null;

      this.courseId = params.get('id');
      if (this.courseId) {
        // Find the course in the service
        this.courseData
          .getCourseById(this.courseId)
          .then((course: Course | undefined) => {
            this.course = course;
            if (this.course && this.course.color) {
              this.courseColor = this.course.color;
            } else {
              console.error('Course not found');
              window.history.back();
            }
          })
          .catch((error: Error) => {
            console.error('Error fetching course:', error);
            window.history.back();
          });
      }
    });
  }

  viewQuestions(questionSet: QuestionSet): void {
    this.selectedQuestionSet = questionSet; // Set the selected question set
  }
}
