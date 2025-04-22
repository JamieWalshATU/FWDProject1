import { Component, OnInit } from '@angular/core';
import { DashboardDataService } from '../../services/dashboard-data.service';
import { Course, QuestionSet } from '../../services/storage/models/course.model';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
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
  recentCourseId: string | null = null; 
  recentQuestionSetId: string | null = null; 
  courseColor: string | null = null;
  recentImageUrl: string | null = null; 

  // This variable is used to animate the score percentage
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
      if (this.recentImageUrl) {
        document.documentElement.style.setProperty(
          '--imageURL',
          `url(${this.recentImageUrl})`
        );
      }
    });
    // Set up an interval to update the score percentage every second, used to animate the spinner and score on start-up,
    setInterval(() => {
      if (this.recentScorePercentage) {
        this.scorePercentageAnimated = parseFloat(this.recentScorePercentage);
      }
    }, 1000);
  }

  async loadRecentData(): Promise<void> {
    try {
      // Retrieve recent activity data
      this.recentCourse = await this.dashboardDataService.getRecentCourse();
      this.recentQuestionSet = await this.dashboardDataService.getRecentQuestionSet();
      this.recentScore = await this.dashboardDataService.getRecentScore();
      
      // Calculate percentage score if a score exists
      if (this.recentScore !== null) {
        // Use question count or fallback to 1 to avoid division by zero
        const totalQuestions = this.recentQuestionSet?.questions.length || 1;
        const percentage = (this.recentScore / totalQuestions) * 100;
        this.recentScorePercentage = percentage.toFixed(2);
      } else {
        this.recentScorePercentage = null;
      }
      
      this.recentCourseId = this.recentCourse?.id || null;
      this.recentQuestionSetId = this.recentQuestionSet?.id || null;
      this.recentImageUrl = this.recentCourse?.imageUrl || null;
    } catch (error) {
      console.error('Failed to load recent activity data:', error);
    }
  }
}
