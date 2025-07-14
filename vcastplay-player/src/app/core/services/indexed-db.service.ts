import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { DBSchema } from '../interfaces/dbSchema';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {

  private dbPromise: Promise<IDBPDatabase<DBSchema>>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private async initDB(): Promise<IDBPDatabase<DBSchema>> {
    return await openDB<DBSchema>('Contents', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('items')) {
          db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
        }
      }
    })
  }

  async addItem(item: DBSchema['items']['value']): Promise<any> {
    const db = await this.dbPromise;
    return await db.add('items', item);
  }

  async getAllItems(): Promise<DBSchema['items']['value'][]> {
    const db = await this.dbPromise;
    return await db.getAll('items');
  }

  async getItem(id: number): Promise<DBSchema['items']['value'] | undefined> {
    const db = await this.dbPromise;
    return await db.get('items', id);
  }

  async updateItem(item: DBSchema['items']['value']): Promise<void> {
    const db = await this.dbPromise;
    await db.put('items', item);
  }

  async deleteItem(id: number): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('items', id);
  }

  async clearItems(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear('items');
  }

  async database() { return await this.dbPromise; }
}
