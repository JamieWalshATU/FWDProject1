import { routes } from './../app.routes';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonSelectOption,
  IonSelect,
  IonList,
  IonRadioGroup,
  IonRadio,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonListHeader,
  IonButton,
  IonNote,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { CourseData } from '../course-data.service';
import { Course, QuestionSet } from '../course.model';
import { DashboardDataService } from '../dashboard-data.service';

@Component({
  selector: 'app-mcqtest',
  templateUrl: './mcqtest.page.html',
  styleUrls: ['./mcqtest.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonRadioGroup,
    IonLabel,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonList,
    IonRadio,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonListHeader,
    IonNote,
  ],
})
export class MCQTestPage implements OnInit {
  course: Course | undefined;
  courseId: string | null = null;
  courseColor: string | null = null;

  selectedQuestionSetId: string | null = null;
  selectedQuestionSet: QuestionSet | null = null;

  // Track user answers by question index
  userAnswers: { [questionIndex: number]: string } = {};
  score: number = 0;
  totalQuestions: number = 0;
  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private courseData: CourseData,
    private dashboardDataService: DashboardDataService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.selectedQuestionSetId = params.get('questionSetId');
      this.courseId = params.get('courseId');
      if (this.courseId) {
        this.courseData.getCourseById(this.courseId).then((course) => {
          this.course = course;
          if (this.course && this.selectedQuestionSetId) {
            this.selectedQuestionSet =
              this.course.questionSets.find(
                (set) => set.id === this.selectedQuestionSetId,
              ) ?? null;
            this.courseColor = this.courseId
              ? this.courseData.getCourseColor(this.courseId)
              : null;
            console.log('Color: ' + this.courseColor);
            if (this.courseColor) {
              document.documentElement.style.setProperty(
                '--course-color',
                this.courseColor,
              );
            }
            // Generate shuffled answers for each question
            if (this.selectedQuestionSet) {
              this.totalQuestions = this.selectedQuestionSet.questions.length;
              this.selectedQuestionSet.questions.forEach((question) => {
                question.shuffledAnswers = this.shuffleAnswers(question);
              });
            }
          }
        });
      }
    });
  }

  shuffleAnswers(question: {
    correctAnswer: string;
    wrongAnswers: string[];
  }): string[] {
    // Combine correctAnswer and wrongAnswers into a single array
    const allAnswers = [question.correctAnswer, ...question.wrongAnswers];

    // Shuffle the array using the Durstenfeld Shuffle (Reference: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array)
    for (var i = allAnswers.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = allAnswers[i];
      allAnswers[i] = allAnswers[j];
      allAnswers[j] = temp;
    }
    return allAnswers;
  }

  // Handle answer selection for a specific question
  handleChange(event: any, questionIndex: number): void {
    const selectedAnswer = event.detail.value;
    this.userAnswers[questionIndex] = selectedAnswer;
    console.log(`Question ${questionIndex + 1}: Selected "${selectedAnswer}"`);
  }

  // Submit answers and calculate the score
  submitAnswers(): void {
    if (!this.selectedQuestionSet || !this.selectedQuestionSet.questions) {
      return;
    }

    this.score = 0;

    // Compare user answers with correct answers
    this.selectedQuestionSet.questions.forEach((question, index) => {
      const userAnswer = this.userAnswers[index];
      if (userAnswer === question.correctAnswer) {
        this.score++;
      }
    });

    this.submitted = true;

    // Initialize totalScores if it doesn't exist
    if (!this.selectedQuestionSet.totalScores) {
      this.selectedQuestionSet.totalScores = [];
    }

    // Add the current score to the totalScores array
    this.selectedQuestionSet.totalScores.push(this.score);

    // Update the recent course and question set in the dashboard data service
    // This will be used to display the most recent score in the dashboard
    if (this.course && this.selectedQuestionSet) {
      this.dashboardDataService
        .updateRecents(this.course, this.selectedQuestionSet, this.score)
        .then(() => {
          console.log('Recent data updated successfully.');
        })
        .catch((error) => {
          console.error('Error updating recent data:', error);
        });
    }

    // Save the updated course with the new score
    if (this.course && this.courseId) {
      this.courseData
        .updateCourse(this.course as Course)
        .then(() => {
          console.log('Score saved successfully');
        })
        .catch((error) => {
          console.error('Error saving score:', error);
        });
    }

    console.log('Submitted Answers:', this.userAnswers);
    console.log(`Score: ${this.score}/${this.totalQuestions}`);
    console.log(
      'All scores for this set:',
      this.selectedQuestionSet.totalScores,
    );
  }

  // Reset the test to allow retaking
  retakeTest(): void {
    this.submitted = false;
    this.userAnswers = {};
    this.score = 0;

    // Re-shuffle answers
    if (this.selectedQuestionSet) {
      this.selectedQuestionSet.questions.forEach((question) => {
        question.shuffledAnswers = this.shuffleAnswers(question);
      });
    }
  }

  return() {
    window.history.back();
  }
}
