import { Component, OnInit } from '@angular/core';
import { OrientationListenerEvent } from '@capacitor/motion';
import { PluginListenerHandle } from '@capacitor/core';
import { Motion } from '@capacitor/motion';
import { FlashlightService } from 'src/app/services/flashlight.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  alarmActivated: boolean = false;
  audio: string = '../../../assets/audios/';

  left: string = this.audio + 'left.mp3';
  right: string = this.audio + 'right.mp3';
  isPlaying: boolean = false; // Indicador para rastrear si un sonido se está reproduciendo
  activeFlash: boolean = false;

  constructor(private flashlightService: FlashlightService) { }

  ngOnInit() {
    this.startOrientationListener();
  }

  startOrientationListener() {
    Motion.addListener('orientation', (event: OrientationListenerEvent) => {
      if (this.alarmActivated) {
        this.handleOrientationChange(event);
      }
    });
  }

  handleOrientationChange(event: OrientationListenerEvent) {
    const { gamma } = event;
    if (gamma < 0) {
      this.playSound(this.left);
      // this.flashlight.switchOn();
      this.turnOffFlashlight();
    } else {
      this.playSound(this.right);
      this.turnOnFlashlight();
    }
  }

  playSound(side: string) {
    if (!this.isPlaying) { // Solo reproducir si no hay otro sonido reproduciéndose
      this.isPlaying = true;
      const audio = new Audio(side);
      audio.play();
      audio.onended = () => { // Resetear indicador cuando el sonido termina
        this.isPlaying = false;
      };
      audio.onerror = () => { // Asegurar resetear el indicador en caso de error
        this.isPlaying = false;
      };
    }
  }

  toggleAlarm() {
    this.alarmActivated = !this.alarmActivated;
  }

  turnOnFlashlight() {
    this.flashlightService.switchOn().then(() => {
      console.log('Linterna encendida');
    }).catch(error => {
      console.error('Error al encender la linterna', error);
    });
  }

  turnOffFlashlight() {
    this.flashlightService.switchOff().then(() => {
      console.log('Linterna apagada');
    }).catch(error => {
      console.error('Error al apagar la linterna', error);
    });
  }

  toggleFlashlight() {
    this.flashlightService.toggle().then(() => {
      console.log('Linterna cambiada');
    }).catch(error => {
      console.error('Error al cambiar la linterna', error);
    });
  }
}
