import { v4 as uuidv4 } from 'uuid';

/*
 Course Model:
 This file defines the structure of the Course and its associated data, including questions.
 Without the outlined data structure and interfaces, the API cannot be used to
 create courses and questions.
*/

// Interface for a multiple-choice question
export interface McqQuestion {
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
  shuffledAnswers?: string[]; // Shuffled answers so that the correct answer is not always first. ** This was due to logic in the mcq test and is currently a work-around. MCQTestPage.ts should handle this. **
} 
// Interface for the set's of MCQ questions
export interface QuestionSet {
  name: string;
  id: string;
  questions: McqQuestion[];
  totalScores: number[];
}

// Interface for the course data
export class Course {
  name: string;
  id: string;
  color: string;
  description: string = '';
  questionSets: QuestionSet[] = []; 
  questions: any;
  imageUrl: string;

  constructor(name: string, color: string) {
    this.name = name;
    this.color = color;
    this.id = uuidv4(); // Generates a unique ID using uuid
    this.description = `This is a course on ${name}`;
    this.questionSets = [];
    this.imageUrl = this.generateImageURL();
  }

  // Generates a random image URL for the course from a sample of 6 images
  generateImageURL() {
    const rndInt = Math.floor(Math.random() * 6) + 1;
    // Images are stored in the assets/images directory as image1.jpg, image2.jpg, etc.
    this.imageUrl = `assets/images/image${rndInt}.jpg`; 
    return this.imageUrl;
  }

  addQuestionSet(name: string, questions: McqQuestion[]): void {
    const newSet: QuestionSet = {
      name,
      id: uuidv4(), // Generates a unique ID for the question set using uuid
      questions,
      totalScores: [], 
    };
    this.questionSets.push(newSet);
  }

}
