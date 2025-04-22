# CourseDetailsPage

**Source**: `src/app/core/features/courses/course-details/course-details.page.ts`

## Overview
`CourseDetailsPage` displays a selected course's details, shows its question sets, embeds the `PdfParserComponent` to upload new questions, and lets instructor add/delete sets or start a quiz.



## Initialization
```ts
ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    this.courseId = params.get('id');
    if (this.courseId) {
      this.courseData.getCourseById(this.courseId)
        .then(course => {
          this.course = course;
          if (course) {
            this.courseColor = course.color;
            this.courseImage = course.imageUrl;
          }
        });
    }
  });
}
```
- Subscribes to route, fetches course by `id`, sets color and image.

## Managing Question Sets
```ts
viewQuestions(set: QuestionSet): void {
  this.selectedQuestionSet = set;
}

deleteSet(setId: string): void {
  if (this.course) {
    this.course.removeQuestionSet(setId);
    this.courseData.updateCourse(this.course);
  }
}

takeTest(set: QuestionSet): void {
  if (this.courseId) {
    window.location.href = `/mcqtest/${this.courseId}/${set.id}`;
  }
}
```
- `viewQuestions` selects and displays set.
- `deleteSet` removes by ID and persists.
- `takeTest` navigates to MCQ test.

## Template Highlights
- `<ion-card>` showing course name, description
- `<app-pdf-parser [id]="courseId" [color]="courseColor">`
- `<ion-accordion-group>` listing question sets with badges
- Buttons: Add Set, Delete, Take Test

---

*End of CourseDetailsPage breakdown.*