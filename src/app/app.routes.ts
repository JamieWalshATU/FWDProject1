import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'course-create',
    pathMatch: 'full',
  },
  {
    path: 'course-create',
    loadComponent: () =>
      import('./core/features/courses/course-create/course-create.page').then(
        (m) => m.CourseCreatePage,
      ),
  },
  {
    path: 'course-details/:id',
    loadComponent: () =>
      import('./core/features/courses/course-details/course-details.page').then(
        (m) => m.CourseDetailsPage,
      ),
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.page').then((m) => m.AboutPage),
  },
  {
    path: 'mcqtest/:courseId/:questionSetId',
    loadComponent: () =>
      import('./core/features/mcqtest/mcqtest.page').then((m) => m.MCQTestPage),
  },
];
