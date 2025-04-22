import { Course, QuestionSet } from './course.model';

/**
 * Interface representing dashboard data that is stored in local storage
 */
export interface DashboardData {
  recentCourse: Course | null;
  recentQuestionSet: QuestionSet | null;
  recentScore: number | null;
  recentCourseId: string | null; 
  recentQuestionSetId: string | null; 
  recentImageUrl: string | null;
}