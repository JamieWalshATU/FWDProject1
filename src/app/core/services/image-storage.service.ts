import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ImageStorageService {
  private STORAGE_KEY = 'stored_images';
  private _storage: Storage | null = null;
  
  constructor(private storage: Storage) {
    this.init();
  }
  
  async init() {
    // Create storage instance
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async saveImage(file: File, fileName: string): Promise<void> {
    try {
      const base64 = await this.convertToBase64(file);
      await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Data,
      });
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  }

  async uploadImage(file: File): Promise<string> {
    try {
      // Generate a unique file name once
      const fileName = new Date().getTime() + '.jpeg';
      await this.saveImage(file, fileName);

      const fileData = await Filesystem.readFile({
        path: fileName,
        directory: Directory.Data,
      });

      const imageUrl = `data:image/jpeg;base64,${fileData.data}`;
      return imageUrl;
      
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async getStoredImages(): Promise<string[]> {
    if(!this._storage) {
      await this.init();
    }
    
    const imageNames = await this.getImageNames();

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
  }

  private async getImageNames(): Promise<string[]> {
    if(!this._storage) {
      await this.init();
    }
    
    const result = await this._storage?.get(this.STORAGE_KEY);
    return result ? JSON.parse(result) : [];
  }
  // Converts to Base64 and separates the metadata from the Base64 String,
  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
}