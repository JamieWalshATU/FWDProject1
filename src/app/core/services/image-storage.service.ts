import { Injectable } from '@angular/core';
import { ImageRepository } from './storage/repositories/image.repository';

@Injectable({
  providedIn: 'root'
})
export class ImageStorageService {
  constructor(private imageRepository: ImageRepository) {}

  async saveImage(file: File, fileName: string): Promise<void> {
    return this.imageRepository.saveImage(file, fileName);
  }

  async uploadImage(file: File): Promise<string> {
    return this.imageRepository.uploadImage(file);
  }

  async getStoredImages(): Promise<string[]> {
    return this.imageRepository.getStoredImages();
  }

  async deleteImage(fileName: string): Promise<void> {
    return this.imageRepository.deleteImage(fileName);
  }
}