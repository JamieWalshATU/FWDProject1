import { CourseData } from './course-data.service';
import { Injectable } from '@angular/core';
import { Course, McqQuestion, QuestionSet } from './course.model';
import { Storage } from '@ionic/storage-angular';


// Saves all Dashboard data in a single object
// This is to avoid multiple storage calls and to keep the code clean
export interface DashboardData {
  recentCourse: Course | null;
  recentQuestionSet: QuestionSet | null;
  recentScore: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardDataService {
  private dashboardData: DashboardData = {
    recentCourse: null,
    recentQuestionSet: null,
    recentScore: null,
  };

  constructor(
    private courseData: CourseData,
    private storage: Storage
  ) {
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

  async initStorage(): Promise<void> {
    await this.storage.create();
    const storedDashboardData = await this.storage.get('dashboardData');
    if (storedDashboardData) {
      this.dashboardData = JSON.parse(storedDashboardData);
    }
  }

  async updateRecents(course: Course, questionSet: QuestionSet, score: number): Promise<void> {
    this.dashboardData.recentCourse = course;
    this.dashboardData.recentQuestionSet = questionSet;
    this.dashboardData.recentScore = score;

    // Save the updated dashboard data to storage
    await this.storage.set('dashboardData', JSON.stringify(this.dashboardData));

    console.log('Dashboard data updated:', this.dashboardData);
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

  async clearRecents(): Promise<void> {
    this.dashboardData = {
      recentCourse: null,
      recentQuestionSet: null,
      recentScore: null,
    };

    // Clear the dashboard data from storage
    await this.storage.remove('dashboardData');

    console.log('Dashboard data cleared.');
  }
}
