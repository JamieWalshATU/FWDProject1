import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { STORAGE_KEYS } from '../models/storage.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {}

  async createItem<T>(key: string, value: T) {
    await this.storage.create();
    if (!this.validateKey(key)) {
      console.warn(`Key "${key}" does not follow the recommended naming convention`);
    }
    
    await this.storage.set(key, JSON.stringify(value));
    return value;
  }

  async getItem<T>(key: string): Promise<T | null> {
    await this.storage.create();
    const value = await this.storage.get(key);
    return value ? JSON.parse(value) : null;
  }

  async updateItem<T>(key: string, value: T) {
    await this.storage.create();
    await this.storage.set(key, JSON.stringify(value));
  }

  async deleteItem(key: string): Promise<void> {
    await this.storage.create();
    await this.storage.remove(key);
  }

  async getKeys(): Promise<string[]> {
    await this.storage.create();
    return await this.storage.keys();
  }

  async getKeysByPrefix(prefix: string): Promise<string[]> {
    await this.storage.create();
    const allKeys = await this.storage.keys();
    return allKeys.filter(key => key.startsWith(prefix));
  }

  async clearNamespace(namespace: string): Promise<void> {
    await this.storage.create();
    const keysToRemove = await this.getKeysByPrefix(namespace);
    for (const key of keysToRemove) {
      await this.deleteItem(key);
    }
  }

  createNamespacedKey(namespace: string, key: string): string {
    return `${namespace}:${key}`;
  }

  validateKey(key: string): boolean {
    const keyRegex = /^[a-zA-Z0-9-_:]+$/;
    const isValidFormat = keyRegex.test(key);
    const isValidLength = key.length <= 100;
    
    return isValidFormat && isValidLength;
  }

  async setMany<T>(items: { key: string, value: T }[]): Promise<void> {
    await this.storage.create();
    for (const item of items) {
      await this.createItem(item.key, item.value);
    }
  }

  async getMany<T>(keys: string[]): Promise<(T | null)[]> {
    await this.storage.create();
    const results: (T | null)[] = [];
    for (const key of keys) {
      results.push(await this.getItem<T>(key));
    }
    return results;
  }

  async removeMany(keys: string[]): Promise<void> {
    await this.storage.create();
    for (const key of keys) {
      await this.deleteItem(key);
    }
  }

  async getStorageSize(): Promise<number> {
    await this.storage.create();
    const keys = await this.getKeys();
    let totalSize = 0;
    
    for (const key of keys) {
      const value = await this.storage.get(key);
      totalSize += (key.length + (value ? value.length : 0));
    }
    
    return totalSize;
  }

  async getCourses(): Promise<any[] | null> {
    return this.getItem<any[]>(STORAGE_KEYS.COURSES.ALL);
  }

  async getDashboardData(): Promise<any | null> {
    return this.getItem<any>(STORAGE_KEYS.DASHBOARD.DATA);
  }

  async getImagesList(): Promise<any[] | null> {
    return this.getItem<any[]>(STORAGE_KEYS.IMAGES.LIST);
  }
}
