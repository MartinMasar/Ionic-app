import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {
  }

  async saveSelectedValue(input: any, name: string) {
    await this.storage.set(name, JSON.stringify(input));
  }

  async getSelectedValue(key: string): Promise<any> {
    const data = await this.storage.get(key);
    return JSON.parse(data);
  }

  async deleteData(key: string) {
    await this.storage.remove(key);
  }

  async clearStorage(){
    await this.storage.clear();
  }

}
