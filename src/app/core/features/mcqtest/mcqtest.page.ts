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
import { CourseData } from '../../services/course-data.service';
import { Course, QuestionSet } from '../../models/course.model';
import { DashboardDataService } from '../../services/dashboard-data.service';
import { ErrorLoggerService } from '../../services/error-logger.service';

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

/* 
Track user answers by question index using a computed property signature. 
I initially used an array (userAnswers[0], userAnswers[1], etc.), but ran into issues when the number of questions changed dynamically.
The array approach caused problems with non-sequential indices, so I switched to using a computed property signature. 
This allows me to dynamically store answers by question index, making it more flexible and easier to handle changing question sets. 

Helpful resources: 
https://stackoverflow.com/questions/74266527/typescript-how-to-initialize-object-with-dynamic-keys-using-index-signature?
https://dmitripavlutin.com/typescript-index-signatures/
*/
  userAnswers: { [questionIndex: number]: string } = {};
  score: number = 0;
  totalQuestions: number = 0;
  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private courseData: CourseData,
    private dashboardDataService: DashboardDataService,
    private logger: ErrorLoggerService,
  ) {}

  ngOnInit(): void {
    
    // Returns courseId and questionSetId from the URL parameters
    this.route.paramMap.subscribe((params) => {
      this.selectedQuestionSetId = params.get('questionSetId');
      this.courseId = params.get('courseId');
      
      // If courseId is present, fetch the course data
      if (this.courseId) {
        this.courseData.getCourseById(this.courseId) 
          .then((course) => {
            this.course = course; 

            if (this.course && this.selectedQuestionSetId) {

              this.selectedQuestionSet = this.course.questionSets.find(
                (set) => set.id === this.selectedQuestionSetId
              ) ?? null; 

              this.courseColor = this.courseId
                ? this.courseData.getCourseColor(this.courseId)
                : null; 
              // Set the course color as a CSS variable, used where course color couldn't be implemented consistently
              // ** This is a workaround to set the course color in the CSS variable, and is to be changed where possible **
              if (this.courseColor) {
                document.documentElement.style.setProperty(
                  '--course-color', 
                  this.courseColor  
                );
              }
              
              // If the selected question set is found, shuffle the answers
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
    this.logger.log(`Question ${questionIndex + 1}: Selected "${selectedAnswer}"`);
  }

  // Submit answers and calculate the score
  submitAnswers(): void {
    if (!this.selectedQuestionSet || !this.selectedQuestionSet.questions) {
      return;
    }

    this.score = 0;
    // Calculate the score based on correct answers
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

    this.selectedQuestionSet.totalScores.push(this.score);

    // Update the recent course and question set in the dashboard data service
    // This will be used to display the most recent score in the dashboard on startup
    if (this.course && this.selectedQuestionSet) {
      this.dashboardDataService
        .updateRecents(this.course, this.selectedQuestionSet, this.score)
        .then(() => {
          this.logger.log('Recent data updated successfully.');
        })
        .catch((error) => {
          const errorMessage = `Error updating recent data: ${String(error)}`;
          this.logger.log(errorMessage);
        });
    }

    // Save the updated course with the new score
    if (this.course && this.courseId) {
      this.courseData
        .updateCourse(this.course as Course)
        .then(() => {
          this.logger.log('Score saved successfully');
        })
        .catch((error) => {
          const errorMessage = `Error saving score: ${String(error)}`;
          this.logger.log(errorMessage);
        });
    }

    this.logger.log('Submitted Answers: ' + JSON.stringify(this.userAnswers));
    this.logger.log(`Score: ${this.score}/${this.totalQuestions}`);
    this.logger.log(
      'All scores for this set: ' + JSON.stringify(this.selectedQuestionSet?.totalScores)
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
