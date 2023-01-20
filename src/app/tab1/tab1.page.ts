import { Component } from '@angular/core';
import {ApiService} from '../services/api/api.service';
import{SettingsPage} from "../pages/settings/settings.page"
import {ModalController} from "@ionic/angular";
import {StorageService} from "../services/storage/storage.service";
import {AlertController} from "@ionic/angular";

export interface jok {
  joke: string;
  favorite: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  inputValue: string = "";
  ree: any;
  jokes: jok[] = [];
  favorite: string[] = [];
  jokecount: number = 0;
  calls: number = 0;

  constructor(private apiService: ApiService, private modalCtrl: ModalController, private storageService: StorageService,
              private alertController: AlertController) {}

  async getdata(){
    this.favorite= await this.storageService.getSelectedValue("fav");
    if(this.favorite == null){
      this.favorite = [];
    }
  }

  async getinfo(){
    this.jokecount = await this.storageService.getSelectedValue("jokes");
    this.calls = await this.storageService.getSelectedValue("calls");
    if(this.jokecount == null){
      this.jokecount = 0;
    }
    if(this.calls == null){
      this.calls = 0;
    }
  }

  async jokeSearch(){
    await this.getinfo();
    await this.getdata();
    this.jokes.length = 0;
    if(this.inputValue == ""){
      this.apiService.getRandomJoke().subscribe(res =>{
        if(this.favorite.indexOf(res.joke) == -1){
          this.jokes.push({ joke: res.joke, favorite: 'false' });
        }
        else{
          this.jokes.push({ joke: res.joke, favorite: 'true' });
        }
      });
      this.jokecount++;
    }
    else{
      this.jokes.length = 0;
      this.apiService.getJokeByWord(this.inputValue).subscribe(res =>{
        for(let i=0; i<res.results.length; i++){
          this.jokecount++;
          if(this.favorite.indexOf(res.results[i].joke) == -1) {
            this.jokes.push({joke: res.results[i].joke, favorite: 'false'});
          }
          else {
            this.jokes.push({joke: res.results[i].joke, favorite: 'true'});
          }
        }
        if(res.results.length == 0){
          this.jokes.push({joke: "Nothing could be found :(", favorite: "true"});
        }
        this.storageService.saveSelectedValue(this.jokecount, "jokes");
      });
    }

    this.calls++;
    await this.storageService.saveSelectedValue(this.jokecount, "jokes");
    await this.storageService.saveSelectedValue(this.calls, "calls");
  }


  async favoriteFunc(input: string){
    await this.getdata();
    let index;
    if(this.favorite !== null){
      index = this.favorite.indexOf(input);
    }else{
      index = -1;
      this.favorite = [];
    }

    if(index == -1){
        this.favorite.push(input);
        await this.storageService.deleteData("fav");
        await this.storageService.saveSelectedValue(this.favorite, "fav");
      }
      else{
        let answer = await this.deleteAlert();
        if(answer == "Yes") {
          this.favorite.splice(index, 1);
          await this.storageService.deleteData("fav");
          await this.storageService.saveSelectedValue(this.favorite, "fav");
        }
      }

    this.jokes.forEach((value) =>{
      let index = this.favorite.indexOf(value.joke);
      if (index == -1){
        value.favorite="false";
      }
      else{
        value.favorite="true";
      }
    });
  }

  async ionViewWillEnter(){
    await this.getdata();
    this.jokes.forEach((value) =>{
      let index = this.favorite.indexOf(value.joke);
      if (index == -1){
        value.favorite="false";
      }
      else{
        value.favorite="true";
      }
    });
  }

  async ngOnInit(){
    await this.getinfo();
  }

  async openSettings() {
    await this.openModal();
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: SettingsPage,
    });
    await modal.present();
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

}


