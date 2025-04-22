import { Injectable } from '@angular/core';
import { StorageService } from '../base/storage.service';
import { STORAGE_KEYS } from '../models/storage.model';
import { Course, QuestionSet } from '../models/course.model';
import { DashboardData } from '../../../services/dashboard-data.service';

@Injectable({
    providedIn: 'root',
})
export class DashboardRepository {
    private dashboardData: DashboardData = {
        recentCourse: null,
        recentQuestionSet: null,
        recentScore: null,
        recentCourseId: null, 
        recentQuestionSetId: null, 
        recentImageUrl: null,
    };

    constructor(private storageService: StorageService) {
        this.initializeStorage();
    }
    
    private async initializeStorage(): Promise<void> {
        try {
            const storedDashboardData = await this.storageService.getItem<DashboardData>(STORAGE_KEYS.DASHBOARD.DATA);
            if (storedDashboardData) {
                this.dashboardData = storedDashboardData;
            }
        } catch (error) {
            throw new Error(`Error initializing storage: ${error}`);
        }
    }

    private async saveDashboardData(): Promise<void> {
        try {
            await this.storageService.updateItem<DashboardData>(STORAGE_KEYS.DASHBOARD.DATA, this.dashboardData);
        } catch (error) {
            throw new Error(`Failed to save dashboard data: ${error}`);
        }
    }

    async updateRecents(
        course: Course,
        questionSet: QuestionSet,
        score: number
    ): Promise<void> {
        try {
            this.dashboardData.recentCourse = course;
            this.dashboardData.recentQuestionSet = questionSet;
            this.dashboardData.recentScore = score;
            this.dashboardData.recentCourseId = course.id;
            this.dashboardData.recentQuestionSetId = questionSet.id;
            this.dashboardData.recentImageUrl = course.imageUrl;
            
            await this.saveDashboardData();
        } catch (error) {
            throw new Error(`Failed to update recent activity: ${error}`);
        }
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

    getRecentImageUrl(): string | null {
        return this.dashboardData.recentImageUrl;
    }

    async clearRecents(): Promise<void> {
        try {
            this.dashboardData = {
                recentCourse: null,
                recentQuestionSet: null,
                recentScore: null,
                recentCourseId: null,
                recentQuestionSetId: null,
                recentImageUrl: null,
            };

            await this.saveDashboardData();
        } catch (error) {
            throw new Error(`Failed to clear recent activity: ${error}`);
        }
    }

    async calculateRecentScorePercentage(): Promise<string | null> {
        try {
            if (this.dashboardData.recentScore !== null && this.dashboardData.recentQuestionSet) {
                const totalQuestions = this.dashboardData.recentQuestionSet.questions.length || 1;
                const percentage = (this.dashboardData.recentScore / totalQuestions) * 100;
                return percentage.toFixed(2);
            }
            return null;
        } catch (error) {
            throw new Error(`Failed to calculate score percentage: ${error}`);
        }
    }
}