import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CourseData } from '../../services/course-data.service';
import { Component, OnInit, Input, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { McqQuestion } from '../../models/course.model';
import { Mistral } from '@mistralai/mistralai';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentOutline } from 'ionicons/icons';
import { ErrorLoggerService } from '../../services/error-logger.service';

@Component({
  selector: 'app-pdf-parser',
  templateUrl: './pdf-parser.component.html',
  styleUrls: ['./pdf-parser.component.scss'],
  imports: [
    FormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
  ],
  standalone: true,
})
export class PdfParserComponent implements OnInit {
  private logger = inject(ErrorLoggerService);

  private apiKey = environment.MISTRAL_API_KEY;
  //private apiKey = ""; Used for error testing
  private client = new Mistral({ apiKey: this.apiKey });
  private uploadedPdf: any;
  public questions: McqQuestion[] = [];
  public invalid: boolean = true;
  public loading: boolean = false;
  constructor(private courseData: CourseData) {
    addIcons({ documentOutline });
  }

  @Input() id: string = '';
  @Input() color: string = '';

  ngOnInit() {
    if (this.apiKey === '') {
      alert(
        'Please set your Mistral API key in the environment file, for help on this refer to the documentation.',
      );
    }
    if (this.color) {
      // Set the color for the course
      // This is a workaround to set the CSS variable for the course color
      document.documentElement.style.setProperty('--course-color', this.color);
    }

    // Initialize document icon for PDF upload
    addIcons({ documentOutline });
  }

  onFileChange(event: any) {
    // Check if the file input has a file
    const file = event.target.files[0];
    if (file) {
      // Disable button while parsing PDF
      this.invalid = true;
      this.parsePdf(file);
    }
  }

  // Method to trigger file input click
  openFileSelector() {
    document.getElementById('pdf-upload')?.click();
  }

  // Uploads the PDF file to Mistral and parses it
  async parsePdf(file: File) {
    // API Usage Guidelines
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', 'ocr');

    try {
      // Show a loading indicator or message
      this.loading = true;

      const response = await this.client.files.upload({
        file: {
          fileName: file.name,
          // Convert the file to an ArrayBuffer, necessary for the Mistral API to process the file
          content: await file.arrayBuffer(),
        },
        purpose: 'ocr',
      });

      this.uploadedPdf = response;
      this.logger.log('File uploaded successfully'); // Log the successful upload
      this.invalid = false; // Enable the button
    } catch (error) {
      this.logger.handleError(error);
      // Show a user-friendly error message
      alert(
        'File upload failed. This may be due to an invalid API key or an unsupported file format. Please verify your API key and ensure the file is a valid PDF. Note: If you are using a free trial API key, it may have expired. Please check its expiration date and try again.',
      );
      this.invalid = true;
    } finally {
      this.loading = false; // Hide loading indicator
    }
  }

  async getChatResponse(): Promise<void> {
    if (!this.uploadedPdf) {
      this.logger.handleError(
        new Error('No PDF file uploaded. Please upload a PDF file first.'),
      );
      return;
    }

    try {
      const signedUrl = await this.client.files.getSignedUrl({
        fileId: this.uploadedPdf.id,
      });
      this.loading = true; // Set loading to true when starting the request
      const chatResponse = await this.client.chat.complete({
        // JSON object containing the model and messages, has to be in the format specified by the Mistral API,
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                // Outlines the response we can expect from the API, lineBreaks are used to separate the questions and answers so the data can be parsed to same way into our services every time without any issues.
                text: 'Can you generate 10 MCQ based questions on this document? Please format each question exactly as follows:\n\nQ: [question text]\nA: [correct answer text]\nW1: [wrong answer 1 text]\nW2: [wrong answer 2 text]\nW3: [wrong answer 3 text]',
              },
              {
                type: 'document_url',
                documentUrl: signedUrl.url,
              },
            ],
          },
        ],
      });

      if (chatResponse.choices && chatResponse.choices.length > 0) {
        const responseContent = chatResponse.choices[0].message
          .content as string;
        this.questions = this.parseQuestions(responseContent);

        this.addQuestionsToCourse(this.questions);
      } else {
        this.logger.handleError(
          new Error('No choices found in chat response.'),
        );
      }
    } catch (error) {
      const errorMessage = `Error getting chat response: ${String(error)}`;
      this.logger.log(errorMessage);
    } finally {
      this.loading = false; // Set loading to false when the request is complete
    }
  }

  parseQuestions(responseContent: string): McqQuestion[] {
    // Updated return type
    const questions: McqQuestion[] = [];
    // Split the response content into lines
    const lines = responseContent.split('\n');

    let currentQuestion: McqQuestion | null = null;

    // Loop through each line and parse the question, correct answer, and wrong answers
    lines.forEach((line) => {
      // If the line starts with 'Q:', it indicates a new question,
      if (line.startsWith('Q:')) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        // Extract the question text and create a new question object, subtracting 2 to remove the 'Q:' prefix
        const questionText = line.substring(2).trim();
        currentQuestion = {
          question: questionText,
          correctAnswer: '',
          wrongAnswers: [],
        };
        // If the line starts with 'A:', it indicates the correct answer, subtracting 2 to remove the 'A:' prefix
      } else if (line.startsWith('A:')) {
        if (currentQuestion) {
          const answerText = line.substring(2).trim();
          currentQuestion.correctAnswer = answerText;
        }
        // If the line starts with 'W1:', 'W2:', or 'W3:', it indicates a wrong answer and is processed accordingly
      } else if (
        line.startsWith('W1:') ||
        line.startsWith('W2:') ||
        line.startsWith('W3:')
      ) {
        if (currentQuestion) {
          // Extract the wrong answer text, subtracts 1 past the index of the colon, so "W1: Apple" becomes "Apple"
          const wrongAnswerText = line.substring(line.indexOf(':') + 1).trim();
          currentQuestion.wrongAnswers.push(wrongAnswerText);
        }
      }
    });

    if (currentQuestion) {
      questions.push(currentQuestion);
    }
    return questions;
  }

  async addQuestionsToCourse(questions: McqQuestion[]): Promise<void> {
    if (this.questions.length === 0) {
      this.logger.handleError(
        new Error('No questions to add. Please call getChatResponse() first'),
      );
      return;
    }

    try {
      // Gets course by ID, and adds the questions to the course
      const course = await this.courseData.getCourseById(this.id);
      if (!course) {
        this.logger.handleError(
          new Error('Course not found. Please check the course ID.'),
        );
        return;
      }
      const questionSetName = `Question Set ${course.questionSets.length + 1}`;
      course.addQuestionSet(questionSetName, this.questions);

      await this.courseData.updateCourse(course);
      // Clears the questions array,
      this.questions = [];
    } catch (error) {
      const errorMessage = `Error updating course with questions: ${String(error)}`;
      this.logger.log(errorMessage);
    }
  }
}
