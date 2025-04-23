import { CourseData } from '../../../services/course-data.service';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
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
import { IonMenuButton, ModalController } from '@ionic/angular/standalone';
import { Course, QuestionSet } from '../../../models/course.model';
import { PdfParserComponent } from '../../pdf-parser/pdf-parser.component';
import { EditImageComponent } from '../../edit-image/edit-image.component';

// Imports Icons from ionicons individually, explained in comment below
import { create, helpCircleOutline, close } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ErrorLoggerService } from '../../../services/error-logger.service';

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
  providers: []
})
export class CourseDetailsPage implements OnInit {
  course: Course | undefined;
  courseId: string | null = null;
  courseColor: string | null = null;
  selectedQuestionSet: QuestionSet | null = null;
  courseImage: string | null = null;
  newImageUrl: string = '';

  // Used to show or hide Edit Picture button & Author credits button on hover
  showButton = false;
  private logger = inject(ErrorLoggerService);

  constructor(
    private route: ActivatedRoute,
    private courseData: CourseData,
    private modalCtrl : ModalController
  ) {
    // Adds ionic Icons, Im unsure if this is the best case way to do this, however I couldn't not find another way to do this which seemed to work as intended
    addIcons({create,helpCircleOutline,close});
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
              this.logger.handleError(new Error('Course not found'));
              window.history.back();
            }
          })
          // If the course is not found, navigate back
          .catch((error: Error) => {
            const errorMessage = `Error fetching course: ${String(error)}`;
            this.logger.log(errorMessage);
            window.history.back();
          });
      }
    });
  }
  // Opens EditImageComponent as a modal, and passes in courseID as a primary key,
  async openEditImageModal() {
    const modal = await this.modalCtrl.create({
      component: EditImageComponent,
      componentProps: {
        courseId: this.courseId,
      },
    });
    // Updates image if Confirm is pressed
    modal.onDidDismiss().then((result) => {
      if (result.role === 'confirm' && result.data) {
        if (this.course) {
          this.course.imageUrl = result.data;
          this.courseData.updateCourse(this.course);
          this.setImageUrl(result.data);
        }
      }
    });
  
    await modal.present();
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
