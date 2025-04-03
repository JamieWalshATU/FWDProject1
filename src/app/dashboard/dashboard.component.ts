import { Component, OnInit } from '@angular/core';
import { DashboardDataService } from '../dashboard-data.service';
import { Course, QuestionSet } from '../course.model';
import {
  IonList,
  IonLabel,
  IonItem,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonNote,
  IonButton,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    CommonModule,
    FormsModule,
    MatProgressSpinner,
    RouterLink,
  ],
  standalone: true,
})
export class DashboardComponent implements OnInit {
  recentCourse: Course | null = null;
  recentQuestionSet: QuestionSet | null = null;
  recentScore: number | null = null;
  recentScorePercentage: string | null = null;

  recentCourseId: string | null = null; // Needed for routing to the recent test set
  recentQuestionSetId: string | null = null; // Needed for routing to the recent test set
  courseColor: string | null = null;

  scorePercentageAnimated: number = 0;

  constructor(private dashboardDataService: DashboardDataService) {}

  ngOnInit(): void {
    this.loadRecentData().then(() => {
      // Set course color after data is loaded
      this.courseColor = this.recentCourse?.color || null;

      // Update CSS variable on the host element
      if (this.courseColor) {
        document.documentElement.style.setProperty(
          '--course-color',
          this.courseColor,
        );
      }

      console.log('Color after loading: ' + this.courseColor);
    });

    setInterval(() => {
      if (this.recentScorePercentage) {
        this.scorePercentageAnimated = parseFloat(this.recentScorePercentage);
      }
    }, 1000); // Update every second
  }

  async loadRecentData(): Promise<void> {
    await this.dashboardDataService.initStorage(); // Ensure storage is initialized
    this.recentCourse = this.dashboardDataService.getRecentCourse();
    this.recentQuestionSet = this.dashboardDataService.getRecentQuestionSet();
    this.recentScore = this.dashboardDataService.getRecentScore();
    this.recentScorePercentage =
      this.recentScore !== null
        ? (
            (this.recentScore /
              (this.recentQuestionSet?.questions.length || 1)) *
            100
          ).toFixed(2)
        : null;
    this.recentCourseId = this.recentCourse?.id || null;
    this.recentQuestionSetId = this.recentQuestionSet?.id || null;
  }
}
