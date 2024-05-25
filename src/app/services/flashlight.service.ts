import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class FlashlightService {

  constructor(private platform: Platform) { }

  switchOn(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.platform.ready().then(() => {
        if (window.plugins && window.plugins.flashlight) {
          window.plugins.flashlight.switchOn(resolve, reject);
        } else {
          reject('Flashlight plugin not available');
        }
      });
    });
  }

  switchOff(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.platform.ready().then(() => {
        if (window.plugins && window.plugins.flashlight) {
          window.plugins.flashlight.switchOff(resolve, reject);
        } else {
          reject('Flashlight plugin not available');
        }
      });
    });
  }

  toggle(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.platform.ready().then(() => {
        if (window.plugins && window.plugins.flashlight) {
          window.plugins.flashlight.toggle(resolve, reject);
        } else {
          reject('Flashlight plugin not available');
        }
      });
    });
  }
}
