import { CourseData } from './course-data.service';
import { Injectable } from '@angular/core';
import { Course, QuestionSet } from '../models/course.model';
import { Storage } from '@ionic/storage-angular';

// Data structure for dashboard data
export interface DashboardData {
  recentCourse: Course | null;
  recentQuestionSet: QuestionSet | null;
  recentScore: number | null;
  recentCourseId: string | null; 
  recentQuestionSetId: string | null; 
  recentImageUrl: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardDataService {
  private STORAGE_KEY = 'dashboardData';
  private initialized = false;
  private dashboardData: DashboardData = {
    recentCourse: null,
    recentQuestionSet: null,
    recentScore: null,
    recentCourseId: null,
    recentQuestionSetId: null,
    recentImageUrl: null,
  };

  constructor(
    private courseData: CourseData,
    private storage: Storage,
  ) {}

  /**
   * Initialize storage and load dashboard data
   * This method is idempotent and can be called multiple times
   */
  async initStorage(): Promise<void> {
    if (this.initialized) return;
    
    try {
      await this.storage.create();
      const storedData = await this.storage.get(this.STORAGE_KEY);
      
      if (storedData) {
        this.dashboardData = JSON.parse(storedData);
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing dashboard storage:', error);
    }
  }

  /**
   * Get courses from CourseData service
   */
  async getCourses(): Promise<Course[]> {
    return this.courseData.getCourseDetails();
  }

  /**
   * Update recent activity with course, question set and score
   */
  async updateRecents(
    course: Course,
    questionSet: QuestionSet,
    score: number,
  ): Promise<void> {
    await this.initStorage();
    
    try {
      this.dashboardData.recentCourse = course;
      this.dashboardData.recentQuestionSet = questionSet;
      this.dashboardData.recentScore = score;
      this.dashboardData.recentCourseId = course.id; 
      this.dashboardData.recentQuestionSetId = questionSet.id; 
      this.dashboardData.recentImageUrl = course.imageUrl;
      
      // Save to storage
      await this.storage.set(this.STORAGE_KEY, JSON.stringify(this.dashboardData));
    } catch (error) {
      console.error('Error updating recent activity:', error);
    }
  }

  /**
   * Get all dashboard data
   */
  async getDashboardData(): Promise<DashboardData> {
    await this.initStorage();
    return this.dashboardData;
  }

  /**
   * Get recent course
   */
  async getRecentCourse(): Promise<Course | null> {
    await this.initStorage();
    return this.dashboardData.recentCourse;
  }

  /**
   * Get recent question set
   */
  async getRecentQuestionSet(): Promise<QuestionSet | null> {
    await this.initStorage();
    return this.dashboardData.recentQuestionSet;
  }

  /**
   * Get recent score
   */
  async getRecentScore(): Promise<number | null> {
    await this.initStorage();
    return this.dashboardData.recentScore;
  }

  /**
   * Clear all recent data
   */
  async clearRecents(): Promise<void> {
    await this.initStorage();
    
    try {
      this.dashboardData = {
        recentCourse: null,
        recentQuestionSet: null,
        recentScore: null,
        recentCourseId: null,
        recentQuestionSetId: null,
        recentImageUrl: null,
      };

      await this.storage.remove(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing dashboard data:', error);
    }
  }
}
