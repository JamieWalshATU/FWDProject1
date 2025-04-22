import { CourseData } from './course-data.service';
import { Injectable } from '@angular/core';
import { Course, QuestionSet } from './storage/models/course.model';
import { DashboardRepository } from './storage/repositories/dashboard.repository';

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
  constructor(
    private courseData: CourseData,
    private dashboardRepository: DashboardRepository
  ) {}

  async getCourses(): Promise<Course[]> {
    return this.courseData.getCourseDetails();
  }

  async updateRecents(
    course: Course,
    questionSet: QuestionSet,
    score: number,
  ): Promise<void> {
    // Fetch the stored course entity
    const storedCourse = await this.courseData.getCourseById(course.id);
    if (!storedCourse) {
      throw new Error(`Course with ID ${course.id} not found`);
    }
    const storedSet = storedCourse.questionSets.find(set => set.id === questionSet.id);
    if (!storedSet) {
      throw new Error(`Question set with ID ${questionSet.id} not found in course ${course.id}`);
    }
    return this.dashboardRepository.updateRecents(storedCourse, storedSet, score);
  }

  async getDashboardData(): Promise<DashboardData> {
    return this.dashboardRepository.getDashboardData();
  }

  async getRecentCourse(): Promise<Course | null> {
    return this.dashboardRepository.getRecentCourse();
  }

  async getRecentQuestionSet(): Promise<QuestionSet | null> {
    return this.dashboardRepository.getRecentQuestionSet();
  }

  async getRecentScore(): Promise<number | null> {
    return this.dashboardRepository.getRecentScore();
  }

  async clearRecents(): Promise<void> {
    return this.dashboardRepository.clearRecents();
  }
}
