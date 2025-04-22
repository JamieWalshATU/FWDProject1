import { Injectable } from "@angular/core";
import { StorageService } from "../base/storage.service";
import { STORAGE_KEYS } from "../models/storage.model";
import { Course, QuestionSet } from "../../../models/course.model";


@Injectable({
  providedIn: "root",
})
export class CourseRepository {
    public courses: Course[] = [];
    constructor(private storageService: StorageService) {}

    async getAll(): Promise<Course[]> {
        return this.getAllCourses();
    }
    
    async getById(id: string): Promise<Course | undefined> {
        return this.getCourseById(id);
    }
    
    async create(entity: Partial<Course>): Promise<Course> {
        if (!entity.name || !entity.color) {
            throw new Error("Course name and color are required");
        }
        return this.createCourse(entity.name, entity.color);
    }
    
    async update(entity: Course): Promise<Course> {
        return this.updateCourse(entity);
    }
    
    async delete(id: string): Promise<void> {
        return this.deleteCourse(id);
    }

    private async saveCourses(): Promise<void> {
        try {
            await this.storageService.updateItem<Course[]>(STORAGE_KEYS.COURSES.ALL, this.courses);
        } catch (error) {
            throw new Error(`Failed to save courses: ${error}`);
        }
    }

    async initializeStorage(): Promise<void> {
        try {
            const courses = await this.storageService.getItem<Course[]>(STORAGE_KEYS.COURSES.ALL);
            this.courses = courses || [];
        } catch (error) {
            throw new Error(`Error initializing storage: ${error}`);
        }
    }
    
    async getAllCourses(): Promise<Course[]> { 
        try {    
            return await this.storageService.getItem<Course[]>(STORAGE_KEYS.COURSES.ALL).then(courses => courses || []);
        } catch (error) {
            throw new Error(`Failed to get all courses: ${error}`);
        }
    }
    
    async getCourseById(id: string): Promise<Course | undefined> {
        try {
            const courseData = await this.storageService.getItem<Course>(STORAGE_KEYS.COURSES.DETAILS(id));
            if (courseData) {
                const course = new Course(courseData.name, courseData.color);
                course.id = courseData.id;
                course.description = courseData.description || '';
                course.questionSets = courseData.questionSets || [];
                course.imageUrl = courseData.imageUrl || '';
                return course;
            }
            return undefined;
        } catch (error) {
            throw new Error(`Failed to get course by ID ${id}: ${error}`);
        }
    }
    
    async createCourse(name: string, color: string): Promise<Course> {
        try {
            const course = new Course(name, color);
            this.courses.push(course);
            await this.storageService.createItem<Course>(STORAGE_KEYS.COURSES.DETAILS(course.id), course);
            await this.saveCourses(); // Save the updated courses array
            return course;
        } catch (error) {
            throw new Error(`Failed to create course: ${error}`);
        }
    }
    
    async updateCourse(updatedCourse: Course): Promise<Course> {
        try {
            const index = this.courses.findIndex(
                (course) => course.id === updatedCourse.id,
            );
            if (index !== -1) {
                this.courses[index] = updatedCourse;
                await this.storageService.updateItem<Course>(STORAGE_KEYS.COURSES.DETAILS(updatedCourse.id), updatedCourse);
                await this.saveCourses(); // Save the updated courses array
                return updatedCourse;
            }
            throw new Error("Course not found");
        } catch (error) {
            throw new Error(`Failed to update course: ${error}`);
        }
    }
    
    async deleteCourse(id: string): Promise<void> {
        try {
            const index = this.courses.findIndex((course) => course.id === id);
            if (index !== -1) {
                this.courses.splice(index, 1);
                await this.storageService.deleteItem(STORAGE_KEYS.COURSES.DETAILS(id));
                await this.saveCourses(); // Save the updated courses array
            } else {
                throw new Error("Course not found");
            }
        } catch (error) {
            throw new Error(`Failed to delete course: ${error}`);
        }
    }

    async getSetById(courseId: string, setId: string): Promise<QuestionSet | undefined> {
        try {
            const course = await this.getCourseById(courseId);
            return course?.questionSets.find((set) => set.id === setId);
        } catch (error) {
            throw new Error(`Failed to get question set: ${error}`);
        }
    }
    
    async getCourseColor(id: string): Promise<string | null> {
        try {
            const course = await this.getCourseById(id);
            return course ? course.color : null;
        } catch (error) {
            throw new Error(`Failed to get course color: ${error}`);
        }
    }
}