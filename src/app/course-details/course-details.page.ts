import { CourseData } from './../course-data.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonList,
  IonButton,
  IonAccordionGroup,
  IonBadge,
  IonCardSubtitle,
  IonAccordion,
  IonIcon,
} from '@ionic/angular/standalone';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonMenuButton } from '@ionic/angular/standalone';
import { Course, QuestionSet } from '../course.model';
import { PdfParserComponent } from '../pdf-parser/pdf-parser.component';

// Imports Icons from ionicons individually, explained in comment below
import { create, helpCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons'; // 

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.page.html',
  styleUrls: ['./course-details.page.scss'],
  standalone: true,
  imports: [
    IonAccordionGroup,
    IonButton,
    IonList,
    IonLabel,
    IonItem,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    RouterModule,
    IonButtons,
    IonMenuButton,
    PdfParserComponent,
    IonBadge,
    IonCardSubtitle,
    IonAccordion,
    IonIcon,
  ],
})
export class CourseDetailsPage implements OnInit {
  course: Course | undefined;
  courseId: string | null = null;
  courseColor: string | null = null;
  selectedQuestionSet: QuestionSet | null = null;
  courseImage: string | null = null;

  // Used to show or hide Edit Picture button & Author credits button on hover
  showButton = false;

  constructor(
    private route: ActivatedRoute,
    private courseData: CourseData,
  ) {
    // Adds ionic Icons, Im unsure if this is the best case way to do this, however I couldn't not find another way to do this which seemed to work as intended
    addIcons({ create, helpCircleOutline });
  }

  ngOnInit(): void {
    // Get the route parameters from the URL
    this.route.paramMap.subscribe((params) => {
      this.selectedQuestionSet = null;



      this.courseId = params.get('id');
      if (this.courseId) {
        // Find the course in the service
        this.courseData
          .getCourseById(this.courseId)
          .then((course: Course | undefined) => {
            this.course = course; 
            // Set the course color and image URL if the course is found
            if (this.course && this.course.color) {
              this.courseColor = this.course.color;
              this.courseImage = this.course.imageUrl;
              this.setImageUrl(this.course.imageUrl);
            } else {
              console.error('Course not found');
              window.history.back();
            }
          })
          // If the course is not found, navigate back
          .catch((error: Error) => {
            console.error('Error fetching course:', error);
            window.history.back();
          });
      }
    });
  }

  viewQuestions(questionSet: QuestionSet): void {
    this.selectedQuestionSet = questionSet; 
  }

  deleteCourse(): void {
    if (this.courseId) {
      this.courseData.deleteCourseById(this.courseId); 
      // Navigate back to the previous page after deletion
      window.history.back(); 
    }
  }

  takeTest(questionSet: QuestionSet): void {
    if (this.courseId) {
    
      this.courseData.updateCourse(this.course as Course).then(() => {
        window.location.href = `/mcqtest/${this.courseId}/${questionSet.id}`;
      });
    }
  }
  // Sets the image URL in the CSS variable for the course image
  setImageUrl(imageUrl: string): void {
    document.documentElement.style.setProperty(
      '--imageURL',
      `url(${imageUrl})`,
    );
  }
}
