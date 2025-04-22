import { v4 as uuidv4 } from 'uuid';

/**
 * Course Model for Unified Storage Architecture
 * This file defines the structure of the Course and its associated data
 * Updated to work with the unified storage approach
 */

/**
 * Interface for a multiple-choice question
 */
export interface McqQuestion {
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
  shuffledAnswers?: string[];
  createdAt?: number;
  lastModified?: number;
}

/**
 * Interface for a set of MCQ questions
 */
export interface QuestionSet {
  name: string;
  id: string;
  questions: McqQuestion[];
  totalScores: number[];
  createdAt: number;
  lastModified: number;
}

/**
 * Class representing a course
 * Maintained as a class rather than an interface to preserve
 * the constructor and methods used throughout the application
 */
export class Course {
  name: string;
  id: string;
  color: string;
  description: string = '';
  questionSets: QuestionSet[] = [];
  imageUrl: string;
  createdAt: number;
  lastModified: number;

  constructor(name: string, color: string) {
    this.name = name;
    this.color = color;
    this.id = uuidv4();
    this.description = `This is a course on ${name}`;
    this.questionSets = [];
    this.imageUrl = this.generateImageURL();
    this.createdAt = Date.now();
    this.lastModified = this.createdAt;
  }

  /**
   * Generates a random image URL for the course from a sample of 6 images
   * @returns The URL for the course image
   */
  generateImageURL(): string {
    const rndInt = Math.floor(Math.random() * 6) + 1;
    this.imageUrl = `assets/images/image${rndInt}.jpg`; 
    return this.imageUrl;
  }

  /**
   * Adds a question set to the course
   * @param name Name of the question set
   * @param questions Array of MCQ questions
   */
  addQuestionSet(name: string, questions: McqQuestion[]): void {
    const now = Date.now();
    const newSet: QuestionSet = {
      name,
      id: uuidv4(),
      questions,
      totalScores: [],
      createdAt: now,
      lastModified: now
    };
    this.questionSets.push(newSet);
    this.lastModified = now;
  }

  /**
   * Updates the details of the course
   * @param details Updated course details
   */
  update(details: Partial<Course>): void {
    if (details.name !== undefined) this.name = details.name;
    if (details.color !== undefined) this.color = details.color;
    if (details.description !== undefined) this.description = details.description;
    if (details.imageUrl !== undefined) this.imageUrl = details.imageUrl;
    
    this.lastModified = Date.now();
  }

  /**
   * Creates a plain object representation of the course suitable for storage
   * @returns A plain object representing the course
   */
  toStorageObject(): object {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      description: this.description,
      questionSets: this.questionSets,
      imageUrl: this.imageUrl,
      createdAt: this.createdAt,
      lastModified: this.lastModified
    };
  }

  /**
   * Creates a Course instance from stored data
   * @param data Stored course data
   * @returns A new Course instance
   */
  static fromStorage(data: any): Course {
    const course = new Course(data.name, data.color);
    course.id = data.id;
    course.description = data.description || '';
    course.questionSets = data.questionSets || [];
    course.imageUrl = data.imageUrl || '';
    course.createdAt = data.createdAt || Date.now();
    course.lastModified = data.lastModified || Date.now();
    return course;
  }
}