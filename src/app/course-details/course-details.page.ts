
import { CourseData } from './../course-data.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonList, IonButton, IonAccordionGroup, IonBadge, IonCardSubtitle, IonAccordion } from '@ionic/angular/standalone';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonMenuButton } from '@ionic/angular/standalone';
import { Course, QuestionSet } from '../course.model';
import { PdfParserComponent } from '../pdf-parser/pdf-parser.component';


@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.page.html',
  styleUrls: ['./course-details.page.scss'],
  standalone: true,
  imports: [IonAccordionGroup, IonButton, IonList, IonLabel, IonItem, IonCardContent, IonCardTitle, IonCardHeader, IonCard,  IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterModule, IonButtons, IonMenuButton, PdfParserComponent, IonBadge, IonCardSubtitle, IonAccordion],
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

  deleteCourse(): void {
    if (this.courseId) {
      this.courseData.deleteCourseById(this.courseId); // Call the service method
      window.history.back(); // Navigate back after deletion
    }
  }
  takeTest(questionSet: QuestionSet): void {
    if (this.courseId) {
      this.courseData.updateCourse(this.course as Course).then(() => {
        window.location.href = `/mcqtest/${this.courseId}/${questionSet.id}`;
      });
    }
  }
}
