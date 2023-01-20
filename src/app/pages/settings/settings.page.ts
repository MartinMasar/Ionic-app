import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {StorageService} from "src/app/services/storage/storage.service";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  favorite: string [] = [];
  jokecount: number = 0;
  calls: number = 0;


  constructor(private modalCtrl: ModalController, private storageService: StorageService, private alertController: AlertController) { }

  ngOnInit() {
    this.getinfo();
    this.getdata();
  }

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

  async dismiss() {
    // dismiss modal
    await this.modalCtrl.dismiss();
  }

  async clerData(){
    let answer = await this.deleteAlert()
    if(answer == "Yes"){
    await this.storageService.clearStorage();
    this.favorite = [];
    this.jokecount = 0;
    this.calls = 0;
    await this.storageService.saveSelectedValue(this.favorite, "fav");
    await this.storageService.saveSelectedValue(this.jokecount, "jokes");
    await this.storageService.saveSelectedValue(this.calls, "calls");
    }
  }

  async deleteAlert() {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: 'Confirm!',
        message: 'Are you sure you want delete all saved data?',
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
