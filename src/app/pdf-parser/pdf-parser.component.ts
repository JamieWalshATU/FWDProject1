import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CourseData } from './../course-data.service';
import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { McqQuestion } from '../course.model';
import { Mistral } from '@mistralai/mistralai';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-pdf-parser',
  templateUrl: './pdf-parser.component.html',
  styleUrls: ['./pdf-parser.component.scss'],
  imports: [FormsModule, CommonModule, MatProgressSpinnerModule],
  standalone: true,
})
export class PdfParserComponent  implements OnInit {
  private apiKey = environment.MISTRAL_API_KEY;
  //private apiKey = ""; Used for error testing
  private client = new Mistral({ apiKey: this.apiKey });
  private uploadedPdf: any;
  public questions: McqQuestion[] = []; 
  public invalid: boolean = true;
  public loading: boolean = false;
  constructor(private courseData: CourseData) { }


  @Input() id: string = '';
  @Input() color: string = '';
  
  
  ngOnInit() {    
    if (this.apiKey === '') {
      alert('Please set your Mistral API key in the environment file, for help on this refer to the documentation.');
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Disable button while parsing PDF
      this.invalid = true;
      this.parsePdf(file);
      console.log("File change detected, course ID:", this.id); // Debugging statement
    }
  }

  async parsePdf(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', 'ocr');

    try {
      // Show a loading indicator or message
      this.loading = true;
      
      const response = await this.client.files.upload({
        file: {
          fileName: file.name,
          content: await file.arrayBuffer(),
        },
        purpose: 'ocr',
      });

      this.uploadedPdf = response;
      console.log('Uploaded PDF:', this.uploadedPdf);
      this.invalid = false; // Enable the button
        } catch (error) {
      console.error('Error uploading file:', error);
      // Show a user-friendly error message
      alert('File upload failed. This may be due to an invalid API key or an unsupported file format. Please verify your API key and ensure the file is a valid PDF. Note: If you are using a free trial API key, it may have expired. Please check its expiration date and try again.');
      this.invalid = true;
    } finally {
      this.loading = false; // Hide loading indicator
    }
  }

  async getChatResponse(): Promise<void> {
    if (!this.uploadedPdf) {
      console.error("No PDF uploaded. Please call parsePdf() first.");
      return;
    }
  
    try {
      const signedUrl = await this.client.files.getSignedUrl({
        fileId: this.uploadedPdf.id,
      });
      this.loading = true; // Set loading to true when starting the request
      const chatResponse = await this.client.chat.complete({
        model: "mistral-small-latest",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Can you generate 10 MCQ based questions on this document? Please format each question exactly as follows:\n\nQ: [question text]\nA: [correct answer text]\nW1: [wrong answer 1 text]\nW2: [wrong answer 2 text]\nW3: [wrong answer 3 text]",
              },
              {
                type: "document_url",
                documentUrl: signedUrl.url,
              },
            ],
          },
        ],
      });
  
      if (chatResponse.choices && chatResponse.choices.length > 0) {
        const responseContent = chatResponse.choices[0].message.content as string;
        this.questions = this.parseQuestions(responseContent);
        this.addQuestionsToCourse(this.questions);
      } else {
        console.error("No choices found in chat response.");
      }
    } catch (error) {
      console.error('Error getting chat response:', error);
    } finally {
      this.loading = false; // Set loading to false when the request is complete
    }
  }

  parseQuestions(responseContent: string): McqQuestion[] { // Updated return type
    const questions: McqQuestion[] = [];
    const lines = responseContent.split('\n');
    let currentQuestion: McqQuestion | null = null;

    lines.forEach(line => {
      //console.log("Processing line:", line); // Debugging statement
      if (line.startsWith('Q:')) {
        if (currentQuestion) {
          questions.push(currentQuestion);
          //console.log("Added question:", currentQuestion); // Debugging statement
        }
        const questionText = line.substring(2).trim();
        currentQuestion = {
          question: questionText,
          correctAnswer: '',
          wrongAnswers: []
        };
        //console.log("New question:", currentQuestion); // Debugging statement
      } else if (line.startsWith('A:')) {
        if (currentQuestion) {
          const answerText = line.substring(2).trim();
          currentQuestion.correctAnswer = answerText;
          //console.log("Added correct answer:", currentQuestion.correctAnswer); // Debugging statement
        }
      } else if (line.startsWith('W1:') || line.startsWith('W2:') || line.startsWith('W3:')) {
        if (currentQuestion) {
          const wrongAnswerText = line.substring(line.indexOf(':') + 1).trim();
          currentQuestion.wrongAnswers.push(wrongAnswerText);
          //console.log("Added wrong answer:", wrongAnswerText); // Debugging statement
        }
      }
    });

    if (currentQuestion) {
      questions.push(currentQuestion);
      //console.log("Added final question:", currentQuestion); // Debugging statement
    }

    //console.log("Final questions array:", questions); // Debugging statement
    return questions;
  }

  async addQuestionsToCourse(questions: McqQuestion[]): Promise<void> {
    if (this.questions.length === 0) {
      console.error("No questions to add. Please call getChatResponse() first.");
      return;
    }

    try {
      console.log("Course ID:", this.id); // Debugging statement
      const course = await this.courseData.getCourseById(this.id);
      if (!course) {
        console.error("Course not found.");
        return;
      }

      const questionSetName = `Question Set ${course.questionSets.length + 1}`;
      course.addQuestionSet(questionSetName, this.questions);

      await this.courseData.updateCourse(course);
      console.log("Updated course with questions:", course);
      this.questions = [];
    } catch (error) {
      console.error("Error updating course with questions:", error);
    }
  }
}
