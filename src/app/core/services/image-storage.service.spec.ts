import { TestBed } from '@angular/core/testing';

import { ImageStorageService } from './core/services/image-storage.service';

describe('ImageStorageService', () => {
  let service: ImageStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
