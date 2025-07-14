import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }

  get(key: string) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;

      return JSON.parse(item);
    } catch (error) {
      return localStorage.getItem(key);
    }
  }

  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }

  hasKey(key: string) {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
