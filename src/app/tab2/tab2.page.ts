import { Component } from '@angular/core';
import {StorageService} from "../services/storage/storage.service";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  shown: string[] = [];
  favorite: string[] = [];
  inputValue: string = "";

  constructor(private storageService: StorageService, private alertController: AlertController) {}

  async getus(){
    this.favorite = await this.storageService.getSelectedValue("fav");
    if(this.favorite == null){
      this.favorite = [];
    }
  }

  async ngOnInit(){
    await this.search();
  }

  async ionViewDidLoad(){
    await this.search()
  }

  async ionViewWillEnter(){
    await this.search()
  }

  async deleteAlert() {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: 'Confirm!',
        message: 'Are you sure you want delete this joke?',
        buttons: [
          {
            text: 'Yes',
            cssClass: 'secondary',
            handler: () => {
              resolve('Yes');
            }
          }, {
            text: 'No',
            role: 'cancel',
            handler: () => {
              resolve('No');
            }
          }
        ]
      });
      await alert.present();
    });
  }

  async favoriteFunc(input: string){
    let answer = await this.deleteAlert();
    if(answer == "Yes"){
    await this.getus();
    let index: number;
    if(this.favorite !== null){
      index = this.favorite.indexOf(input);
    }else{
      index = -1;
      this.favorite = [];
    }
      if(index != -1){
      this.favorite.splice(index,1);
      await this.storageService.deleteData("fav");
      await this.storageService.saveSelectedValue(this.favorite, "fav");
      await this.search();
      }
    }
  }

  async search(){
    this.shown = [];
    await this.getus();
    if(this.inputValue == null){
      this.shown = this.favorite;
    }else{
    this.favorite.forEach(
      (value) => {
        if(value.includes(this.inputValue)){
          this.shown.push(value);
        }
      });
    }
  }

}
