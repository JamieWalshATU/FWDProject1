import { generate } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface McqQuestion {
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
  shuffledAnswers?: string[]; // Optional property to store shuffled answers, created in MCQTestPage so each test has its own shuffled answers
} // Define the structure of a multiple choice question

export interface QuestionSet {
  name: string;
  id: string;
  questions: McqQuestion[];
  totalScores: number[]; // Store the total scores for the set
} // Define the structure of a set of questions

export class Course {
  name: string;
  id: string;
  color: string;
  description: string = '';
  questionSets: QuestionSet[] = []; // Store multiple sets of questions
  questions: any;
  imageUrl : string;

  constructor(name: string, color: string) {
    this.name = name;
    this.color = color;
    this.id = uuidv4(); // Generate a unique id for each course
    this.description = `This is a course on ${name}`;
    this.questionSets = [];
    this.imageUrl = this.initImageURL();
  }

  addQuestionSet(name: string, questions: McqQuestion[]): void {
    const newSet: QuestionSet = {
      name,
      id: uuidv4(),
      questions,
      totalScores: [], // Initialize with an empty array
    };
    this.questionSets.push(newSet);
  }

  initImageURL() {
    const rndInt = Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
    this.imageUrl = `assets/images/image${rndInt}.jpg`; // Use proper template literal with backticks
    return this.imageUrl;
  }
}
