# DashboardComponent

**Source**: `src/app/core/features/dashboard/dashboard.component.ts`

## Overview
`DashboardComponent` shows recent activity: last taken course, question set, score, and quick links to features.

## Properties
- `recentCourse`, `recentQuestionSet`, `recentScore` – retrieved from `DashboardDataService`
- `recentScorePercentage` – computed percentage
- `courseColor`, `recentImageUrl` – styling variables
- `scorePercentageAnimated` – for spinner animation

## Initialization
```ts
ngOnInit(): void {
  this.loadRecentData().then(() => {
    this.courseColor = this.recentCourse?.color || null;
    document.documentElement.style.setProperty('--course-color', this.courseColor || '');
    document.documentElement.style.setProperty('--imageURL', `url(${this.recentImageUrl})`);
  });
  setInterval(() => {
    this.scorePercentageAnimated = parseFloat(this.recentScorePercentage || '0');
  }, 1000);
}
```
- Calls `loadRecentData` to populate fields and update CSS variables
- Starts interval to animate spinner

## Data Loading
```ts
async loadRecentData(): Promise<void> {
  await this.dashboardDataService.initStorage();
  this.recentCourse = this.dashboardDataService.getRecentCourse();
  this.recentQuestionSet = this.dashboardDataService.getRecentQuestionSet();
  this.recentScore = this.dashboardDataService.getRecentScore();
  if (this.recentScore !== null) {
    const total = this.recentQuestionSet?.questions.length || 1;
    this.recentScorePercentage = ((this.recentScore / total) * 100).toFixed(2);
  }
  this.recentCourseId = this.recentCourse?.id || null;
  this.recentQuestionSetId = this.recentQuestionSet?.id || null;
  this.recentImageUrl = this.recentCourse?.imageUrl || null;
}
```
- Initializes storage, retrieves recents, computes percentage, stores IDs and image URL

## Template Highlights
- Card for recent results: spinner showing `scorePercentageAnimated`, buttons to retake test
- Conditional rendering when no data

---

*End of DashboardComponent breakdown.*