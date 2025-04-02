import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'course-create',
    pathMatch: 'full'
  },
  {
    path: 'course-create',
    loadComponent: () => import('./course-create/course-create.page').then(m => m.CourseCreatePage)
  },
  {
    path: 'course-details/:id',
    loadComponent: () => import('./course-details/course-details.page').then( m => m.CourseDetailsPage)
  },

];
