# MCQTestPage

**Source**: `src/app/core/features/mcqtest/mcqtest.page.ts`

## Overview

`MCQTestPage` renders a multiple-choice quiz for a selected course and question set. It handles answer selection, scoring, persistence, and navigation.

## Properties

- `course`, `courseId`, `selectedQuestionSet`, `selectedQuestionSetId` – loaded from `CourseData` and `ActivatedRoute`
- `userAnswers: { [index: number]: string }` – tracks selected answers by question index
- `score`, `totalQuestions`, `submitted` – quiz state
- `courseColor` – CSS variable for theming

## Initialization

```ts
ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    this.courseId = params.get('courseId');
    this.selectedQuestionSetId = params.get('questionSetId');
    if (this.courseId) {
      this.courseData.getCourseById(this.courseId).then(course => {
        this.course = course;
        if (this.course && this.selectedQuestionSetId) {
          this.selectedQuestionSet = this.course.questionSets.find(
            set => set.id === this.selectedQuestionSetId
          ) ?? null;
          this.totalQuestions = this.selectedQuestionSet?.questions.length || 0;
          this.courseColor = this.courseData.getCourseColor(this.courseId);
          document.documentElement.style.setProperty('--course-color', this.courseColor || '');
          this.selectedQuestionSet?.questions.forEach(q => {
            q.shuffledAnswers = this.shuffleAnswers(q);
          });
        }
      });
    }
  });
}
```

- Fetches IDs from URL, loads course and question set, sets theme, shuffles answers.

## Shuffling Answers

```ts
shuffleAnswers(question: { correctAnswer: string; wrongAnswers: string[] }): string[] {
  const all = [question.correctAnswer, ...question.wrongAnswers];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}
```

- Uses Durstenfeld shuffle to randomize answer order.

## Handling Selection

```ts
handleChange(event: any, index: number): void {
  this.userAnswers[index] = event.detail.value;
}
```

- Updates `userAnswers` map on radio change.

## Submitting & Scoring

```ts
submitAnswers(): void {
  this.score = 0;
  this.selectedQuestionSet?.questions.forEach((q, i) => {
    if (this.userAnswers[i] === q.correctAnswer) this.score++;
  });
  this.submitted = true;
  this.selectedQuestionSet!.totalScores = this.selectedQuestionSet!.totalScores || [];
  this.selectedQuestionSet!.totalScores.push(this.score);
  this.dashboardDataService.updateRecents(
    this.course!,
    this.selectedQuestionSet!,
    this.score
  );
  this.courseData.updateCourse(this.course!);
}
```

- Calculates score, updates recents and course persistence.

## Retaking & Navigation

```ts
retakeTest(): void {
  this.submitted = false;
  this.userAnswers = {};
  this.score = 0;
  this.selectedQuestionSet?.questions.forEach(q => q.shuffledAnswers = this.shuffleAnswers(q));
}

return(): void {
  window.history.back();
}
```

- `retakeTest()` resets state and reshuffles.
- `return()` navigates back.

## Template Highlights

- `<ion-list>` of questions with `<ion-radio-group>` for choices
- Submit button disabled until answers selected
- Displays result and retake option after submission

---

_End of MCQTestPage breakdown._
