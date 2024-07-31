import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FaceService } from 'src/services/face.service';
import { ToastController, NavController  } from '@ionic/angular';
import { AuthService } from 'src/services/auth.service';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
@Component({
  selector: 'app-exit',
  templateUrl: './exit.page.html',
  styleUrls: ['./exit.page.scss'],
})
export class ExitPage implements OnInit {
  @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  constructor(private FaceService: FaceService, private toastCtrl: ToastController, private navCtrl: NavController,private authService: AuthService,
    private altCtrl:AlertController,private location: Location
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.startCamera();
  
  }

  async startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (this.video && this.video.nativeElement) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
        } else {
          console.error('Video element is not defined.');
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    } else {
      console.error('getUserMedia not supported in this browser.');
    }
  }
  async captureImage() {
    console.log('Capture Image called');
    const context = this.canvas.nativeElement.getContext('2d');
    if (context) {
      context.drawImage(this.video.nativeElement, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      const imageData = this.canvas.nativeElement.toDataURL('image/jpeg').split(',')[1]; // Capturar la imagen en base64
      this.loginWithFacialRecognition(imageData);
    } else {
      console.error('Canvas context is not defined.');
    }
  }


  loginWithFacialRecognition(imageData: string) {
    this.FaceService.facialLogin(imageData).subscribe(
      async (response) => {
        if (response.success) {
          const currentUserId = this.authService.getUserId();
          if (response.user_id === currentUserId) {
            await this.marcarSalida(response.user_id, response.rol);
          } else {
            this.showToast('Usted es un IMPOSTOR.');
          }
        } else {
          this.showToast(response.message);
        }
      },
      async (error) => {
        this.showToast('Error connecting to server');
      }
    );
  }

  async showAlert(message: string) {
    const alert = await this.altCtrl.create({
      header: 'Alerta',
      message: message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  async marcarSalida(idUsuario: number, rol: string) {
    this.FaceService.marcarSalida(idUsuario).subscribe(
      async (response) => {
        if (response.success) {
          if (response.salida_temprana) {
            await this.showAlert('No se puede salir antes de tiempo.');
          } else {
            await this.showToast('Salida registrada con éxito.');
          }
          await this.destroyToken();  // Destruir el token solo si la salida es exitosa o es una salida temprana
          this.redirectBasedOnRole(rol);
        } else {
          await this.showAlert(response.message);
          this.redirectBasedOnRole(rol);
        }
      },
      async (error) => {
        await this.showAlert('Error registrando salida');
        this.redirectBasedOnRole(rol);
      }
    );
  }

  async destroyToken() {
    this.authService.logout();
  }

  redirectBasedOnRole(role: string) {
    switch (role) {
      case 'admin':
        this.navCtrl.navigateForward('/administrador');
        break;
      case 'Docente':
        this.navCtrl.navigateForward('/teacher');
        break;
      case 'sub-administrador':
        this.navCtrl.navigateForward('/sub-administrador');
        break;
      default:
        this.navCtrl.navigateBack('/login');
        this.showToast('USTED ES UN IMPOSTOR');
        break;
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  // Eliminar el método ionViewWillLeave para evitar la destrucción prematura del token
  // ionViewWillLeave() {
  //   this.destroyToken();
  // }
}