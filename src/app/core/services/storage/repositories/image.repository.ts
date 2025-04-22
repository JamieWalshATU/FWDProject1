import { Injectable } from '@angular/core';
import { StorageService } from '../base/storage.service';
import { STORAGE_KEYS } from '../models/storage.model';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class ImageRepository {
  private imageNames: string[] = [];
  private initialized = false;

  constructor(private storageService: StorageService) {}

  // Lazy initialization of stored image names
  private async init(): Promise<void> {
    if (this.initialized) return;
    this.imageNames = (await this.storageService.getItem<string[]>(STORAGE_KEYS.IMAGES.LIST)) || [];
    this.initialized = true;
  }

  /**
   * Save an image to filesystem
   */
  async saveImage(file: File, fileName: string): Promise<void> {
    const base64 = await this.convertToBase64(file);
    await Filesystem.writeFile({ path: fileName, data: base64, directory: Directory.Data });
    await this.init();
    if (!this.imageNames.includes(fileName)) {
      this.imageNames.push(fileName);
      await this.storageService.updateItem<string[]>(STORAGE_KEYS.IMAGES.LIST, this.imageNames);
    }
  }

  /**
   * Upload an image and get URL
   */
  async uploadImage(file: File): Promise<string> {
    try {
      // Generate a unique file name
      const fileName = new Date().getTime() + '.jpeg';
      await this.saveImage(file, fileName);

      // Read the file and get data URL
      const fileData = await Filesystem.readFile({
        path: fileName,
        directory: Directory.Data,
      });

      const imageUrl = `data:image/jpeg;base64,${fileData.data}`;
      return imageUrl;
    } catch (error) {
      throw new Error(`Error uploading image: ${error}`);
    }
  }

  /**
   * Get all stored images as data URLs
   */
  async getStoredImages(): Promise<string[]> {
    await this.init();
    return Promise.all(
      this.imageNames.map(async name => {
        const file = await Filesystem.readFile({ path: name, directory: Directory.Data });
        return `data:image/jpeg;base64,${file.data}`;
      })
    );
  }

  /**
   * Delete an image by name
   */
  async deleteImage(fileName: string): Promise<void> {
    await Filesystem.deleteFile({ path: fileName, directory: Directory.Data });
    await this.init();
    this.imageNames = this.imageNames.filter(name => name !== fileName);
    await this.storageService.updateItem<string[]>(STORAGE_KEYS.IMAGES.LIST, this.imageNames);
  }

  /**
   * Convert file to base64
   */
  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
}