import { TestBed } from '@angular/core/testing';
import { DashboardDataService } from './dashboard-data.service';
import { IonicStorageModule } from '@ionic/storage-angular';
import { DashboardRepository } from './storage/repositories/dashboard.repository';
import { CourseData } from './course-data.service';
import { StorageService } from './storage/base/storage.service';
import { CourseRepository } from './storage/repositories/course.repository';

describe('DashboardDataService', () => {
  let service: DashboardDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot()],
      providers: [
        DashboardDataService,
        DashboardRepository,
        CourseData,
        CourseRepository,
        StorageService
      ]
    });
    service = TestBed.inject(DashboardDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
