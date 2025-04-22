import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ImageStorageService {
  private STORAGE_KEY = 'stored_images';
  private _storage: Storage | null = null;
  private initialized = false;
  
  constructor(private storage: Storage) {}
  
  /**
   * Initialize the storage service
   * This method is idempotent and can be called multiple times
   */
  async init(): Promise<void> {
    if (this.initialized) return;
    
    this._storage = await this.storage.create();
    this.initialized = true;
  }

  /**
   * Save an image to the filesystem and store its reference
   */
  async saveImage(file: File, fileName: string): Promise<void> {
    try {
      const base64 = await this.convertToBase64(file);
      await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Data,
      });
      
      // Add image name to storage
      const imageNames = await this.getImageNames();
      if (!imageNames.includes(fileName)) {
        imageNames.push(fileName);
        await this._saveImageNames(imageNames);
      }
    } catch (error) {
      console.error('Error saving image:', error);
      throw new Error(`Failed to save image: ${error}`);
    }
  }

  /**
   * Upload an image and return its URL
   */
  async uploadImage(file: File): Promise<string> {
    try {
      // Generate a unique file name
      const fileName = new Date().getTime() + '.jpeg';
      await this.saveImage(file, fileName);

      const fileData = await Filesystem.readFile({
        path: fileName,
        directory: Directory.Data,
      });

      return `data:image/jpeg;base64,${fileData.data}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Failed to upload image: ${error}`);
    }
  }
  
  /**
   * Get all stored images as data URLs
   */
  async getStoredImages(): Promise<string[]> {
    await this.init();
    
    try {
      const imageNames = await this.getImageNames();
      
      if (imageNames.length === 0) {
        return [];
      }
      
      const imagePaths = await Promise.all(
        imageNames.map(async (name) => {
          const file = await Filesystem.readFile({
            path: name,
            directory: Directory.Data,
          });
          return `data:image/jpeg;base64,${file.data}`;
        })
      );

      return imagePaths;
    } catch (error) {
      console.error('Error getting stored images:', error);
      return [];
    }
  }

  /**
   * Delete an image by filename
   */
  async deleteImage(fileName: string): Promise<void> {
    try {
      await Filesystem.deleteFile({
        path: fileName,
        directory: Directory.Data
      });
      
      const imageNames = await this.getImageNames();
      const index = imageNames.indexOf(fileName);
      
      if (index !== -1) {
        imageNames.splice(index, 1);
        await this._saveImageNames(imageNames);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error(`Failed to delete image: ${error}`);
    }
  }

  /**
   * Get all image names from storage
   */
  private async getImageNames(): Promise<string[]> {
    await this.init();
    
    const result = await this._storage?.get(this.STORAGE_KEY);
    return result ? JSON.parse(result) : [];
  }

  /**
   * Save image names to storage
   */
  private async _saveImageNames(imageNames: string[]): Promise<void> {
    await this.init();
    
    await this._storage?.set(this.STORAGE_KEY, JSON.stringify(imageNames));
  }
  
  /**
   * Convert a file to base64 format
   */
  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
}