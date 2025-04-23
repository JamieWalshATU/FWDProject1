import { ImageStorageService } from '../../services/image-storage.service';
import { CourseData } from '../../services/course-data.service';
import { Component, Input, OnInit, inject } from '@angular/core';
import {
  IonHeader,
  IonButton,
  IonContent,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
import { Course } from '../../models/course.model';
import { CommonModule } from '@angular/common';
import { imageOutline, close } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ErrorLoggerService } from '../../services/error-logger.service';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.scss'],
  standalone: true,
  providers: [ModalController],
  imports: [
    CommonModule,
    IonTitle,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonButton,
    IonContent,
    IonIcon,
  ],
})
export class EditImageComponent implements OnInit {
  @Input() courseId: string = '';
  
  private logger = inject(ErrorLoggerService);

  course: Course | undefined;
  newImageUrl: string = '';
  imageUrl: string | null = null;

  constructor(
    private courseData: CourseData,
    private imageStorageService: ImageStorageService,
    private modalCtrl: ModalController,
  ) {
    addIcons({ imageOutline, close });
  }

  ngOnInit() {
    // Load the course data when the modal opens
    if (this.courseId) {
      this.courseData.getCourseById(this.courseId).then((course) => {
        this.course = course;
        if (course?.imageUrl) {
          this.imageUrl = course.imageUrl;
        }
      });
    }
  }

  cancel() {
    // Close the modal without saving changes
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    // Close the modal and return the new image URL
    this.modalCtrl.dismiss(this.newImageUrl, 'confirm');
  }

  async onFileSelected(event: Event): Promise<void> {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      try {
        // Upload the file and get URL
        this.newImageUrl = await this.imageStorageService.uploadImage(file);
        this.imageUrl = this.newImageUrl;
      } catch (error) {
        const errorMessage = `Failed to upload image: ${String(error)}`;
        this.logger.log(errorMessage);
      }
    }
  }
}
