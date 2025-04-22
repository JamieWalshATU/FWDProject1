# CourseCreatePage

**Source**: `src/app/core/features/courses/course-create/course-create.page.ts`

## Overview
`CourseCreatePage` provides a form for instructors to enter course name, description, and color, then create a new course via `CourseDataService`.

## Component Metadata

## Constructor & Form
```ts
constructor(
  private courseData: CourseData,
  private toastCtrl: ToastController,
  private navCtrl: NavController,
  private fb: FormBuilder
) {
  this.courseForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    color: ['#387ef5', Validators.required]
  });
}
```
- Builds reactive form with default color.

## Creating Course
```ts
async generateCourse() {
  if (!this.courseForm.valid) return;
  const { name, description, color } = this.courseForm.value;
  await this.courseData.createCourse(name, color);
  this.showToast('Course created');
  this.loadCourses();
  this.courseForm.reset({ color: '#387ef5' });
  this.navCtrl.pop();
}
```
- Validates form, persists new course, shows toast, resets form, navigates back.

## Template Highlights
- `<form [formGroup]="courseForm">` with `ion-input` for `name`, `color` picker
- Submit `<ion-button (click)="generateCourse()" [disabled]="!courseForm.valid">Create Course</ion-button>`

---

*End of CourseCreatePage breakdown.*