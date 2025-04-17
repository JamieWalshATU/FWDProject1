import { CourseData } from './course-data.service';
import { Injectable } from '@angular/core';
import { Course, McqQuestion, QuestionSet } from '../models/course.model';
import { Storage } from '@ionic/storage-angular';

// Saves all Dashboard data in a single object
// This is to avoid multiple storage calls and to keep the code clean

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
  ) {
    // Creates a separate instance of the storage for the dashboard data
    this.initStorage().then(() => {
      console.log('Dashboard storage initialized:', this.dashboardData);
    });
  }

  Course: Course[] = [];
  mcqQuestion: McqQuestion[] = [];
  getCourses(): Course[] {
    return this.courseData.getCourseDetails();
  }
  ngOnInit() {
    const courses = this.courseData.getCourseDetails();
  }
  // Creates a separate instance of the storage for the dashboard data
  async initStorage(): Promise<void> {
    await this.storage.create();
    const storedDashboardData = await this.storage.get('dashboardData');
    if (storedDashboardData) {
      this.dashboardData = JSON.parse(storedDashboardData);
    }
  }

  async updateRecents(
    course: Course,
    questionSet: QuestionSet,
    score: number,
  ): Promise<void> {
    this.dashboardData.recentCourse = course;
    this.dashboardData.recentQuestionSet = questionSet;
    this.dashboardData.recentScore = score;
    this.dashboardData.recentCourseId = course.id; 
    this.dashboardData.recentQuestionSetId = questionSet.id; 
    this.dashboardData.recentImageUrl = course.imageUrl;
    // Convert the dashboard data to a JSON string and save it to storage
    await this.storage.set('dashboardData', JSON.stringify(this.dashboardData));

  }

  getDashboardData(): DashboardData {
    return this.dashboardData;
  }
  getRecentCourse(): Course | null {
    return this.dashboardData.recentCourse;
  }
  getRecentQuestionSet(): QuestionSet | null {
    return this.dashboardData.recentQuestionSet;
  }
  getRecentScore(): number | null {
    return this.dashboardData.recentScore;
  }

  // Clears the recent course, question set, and score from the dashboard data
  async clearRecents(): Promise<void> {
    this.dashboardData = {
      recentCourse: null,
      recentQuestionSet: null,
      recentScore: null,
      recentCourseId: null,
      recentQuestionSetId: null,
      recentImageUrl: null,
    };

    // Clear the dashboard data from storage
    await this.storage.remove('dashboardData');

    console.log('Dashboard data cleared.');
  }
}
