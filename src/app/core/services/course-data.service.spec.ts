import { TestBed } from '@angular/core/testing';
import { CourseData } from './course-data.service';
import { IonicStorageModule } from '@ionic/storage-angular';
import { CourseRepository } from './storage/repositories/course.repository';
import { StorageService } from './storage/base/storage.service';

describe('CourseData', () => {
  let service: CourseData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot()],
      providers: [CourseData, CourseRepository, StorageService]
    });
    service = TestBed.inject(CourseData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
