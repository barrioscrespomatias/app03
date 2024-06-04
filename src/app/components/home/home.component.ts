import { Component, OnInit, ViewChild } from '@angular/core';
import { OrientationListenerEvent } from '@capacitor/motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Motion } from '@capacitor/motion';
import { FlashlightService } from 'src/app/services/flashlight.service';
import { ToastService } from 'src/app/services/toast.service';
import { AngularFireService } from 'src/app/services/angular-fire.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimationController, IonInput, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  @ViewChild('passwordInput', { static: false }) passwordInput!: IonInput;
  form!: FormGroup;

  alarmActivated: boolean = false;
  isPlaying: boolean = false;
  activeFlash: boolean = false;

  leftSound: string = '../../../assets/audios/left.mp3';
  rightSound: string = '../../../assets/audios/right.mp3';
  verticalSound: string = '../../../assets/audios/i-feel-good.mp3';
  horizontalSound: string = '../../../assets/audios/michael-jackson.mp3';
  erroPasswordSound: string = '../../../assets/audios/civil-defense-siren.mp3';
  alpha : string = '';
  beta : string = '';
  gamma : string = '';
  currentUser:string = '';
  password!:string;

  enabledHorizontal: boolean = false;
  vibrationInterval: any = null;  // Variable para manejar el intervalo de vibración

  constructor(private flashlightService: FlashlightService,
              private toastService:ToastService,
              private angularFireService:AngularFireService,
              private router: Router,
              private navCtrl: NavController,
              private animationCtrl: AnimationController) { }

  async ngOnInit() {
    this.currentUser = await this.angularFireService.GetEmailLogueado();
    console.log(this.currentUser)
    this.form = new FormGroup({
      password: new FormControl('', [
        Validators.pattern(
          '^[a-zA-Z0-9\\s!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>/?]+$'
        ),
        Validators.minLength(4),
        Validators.required,
      ]),
    });

    this.startOrientationListener();
  }

  startOrientationListener() {
    Motion.addListener('orientation', (event: OrientationListenerEvent) => {
      if (this.alarmActivated) {
        this.handleOrientationChange(event);
      }
    });
  }

  async handleOrientationChange(event: OrientationListenerEvent) {
    const { gamma, beta, alpha } = event;

    if (gamma < -10) { // Izquierda
      this.playSound(this.leftSound);
      this.enabledHorizontal = true;
    } else if (gamma > 10) { // Derecha
      this.playSound(this.rightSound);
      this.enabledHorizontal = true;
    } else if (beta > 75 && beta < 95) { // Vertical
      await this.turnOnFlashlight();
      // Feel good
      this.playSound(this.verticalSound); // Emite un sonido al mismo tiempo
      this.enabledHorizontal = true;
      setTimeout(() => { // Apagar la luz después de 5 segundos
        this.turnOffFlashlight();
      }, 5000);
    } else if ((alpha >= -260 && alpha <= 280) && (beta >= -10 && beta <= 10) && (gamma >= -10 && gamma <= 10) && this.enabledHorizontal) { // Horizontal
      this.vibrateAndPlaySound(this.horizontalSound);
    }
  }

  playSound(sound: string) {
    if (!this.isPlaying) { // Solo reproducir si no hay otro sonido reproduciéndose
      this.isPlaying = true;
      const audio = new Audio(sound);
      audio.play();
      audio.onended = () => { // Resetear indicador cuando el sonido termina
        this.isPlaying = false;
      };
      audio.onerror = () => { // Asegurar resetear el indicador en caso de error
        this.isPlaying = false;
      };
    }
  }

  async turnOnFlashlight() {
    await this.flashlightService.switchOn();
  }

  async turnOffFlashlight() {
    await this.flashlightService.switchOff();
  }

  async vibrateAndPlaySound(sound: string) {
    this.playSound(sound); // Emitir el sonido al mismo tiempo
    this.vibrateForDuration(4000); // Iniciar la vibración durante 5 segundos
  }

  vibrateForDuration(duration: number) {
    clearInterval(this.vibrationInterval); // Limpiar cualquier intervalo previo
    const interval = 100;
    let elapsed = 0;

    this.vibrationInterval = setInterval(() => {
      if (elapsed >= duration) {
        clearInterval(this.vibrationInterval);
        Haptics.impact({ style: ImpactStyle.Heavy });
      } else {
        Haptics.impact({ style: ImpactStyle.Heavy });
        elapsed += interval;
      }
    }, interval);

    setTimeout(() => {
      clearInterval(this.vibrationInterval); // Asegurarse de detener la vibración después del tiempo especificado
      Haptics.impact({ style: ImpactStyle.Heavy });
      this.turnOffFlashlight();
    }, duration);
  }

  toggleAlarm() {
    this.alarmActivated = !this.alarmActivated;
  }

  navigateTo(section: string) {
    this.navCtrl.navigateForward(`/${section}`);
  }

  async explotion() {
    await this.turnOnFlashlight();
    this.vibrateAndPlaySound(this.erroPasswordSound); // Emite un sonido al mismo tiempo
  }

  onPasswordChange(password: string) {
    // Aquí puedes acceder al valor de la contraseña
    console.log('Contraseña cambiada:', password);
  }

  disabledAlarm() {
    if (this.currentUser == 'admin@admin.com' && this.password === '111111') {
      this.toggleAlarm();
    } else if (this.currentUser == 'invitado@invitado.com' && this.password === '222222') {
      this.toggleAlarm();
    } else if (this.currentUser == 'usuario@usuario.com' && this.password === '333333') {
      this.toggleAlarm();
    } else {
      this.explotion();
    }
  }

  async SignOut() {
    await this.angularFireService.SignOut();
  }

  onModalPresent() {
    setTimeout(() => {
      this.passwordInput.setFocus();
    }, 300); // El tiempo de espera asegura que el modal esté completamente presentado
  }
}
