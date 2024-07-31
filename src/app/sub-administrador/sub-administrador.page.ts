import { Component, OnInit } from '@angular/core';
import { UsuarioResponse } from 'src/interfaces/intUsuario/UsuarioResponse';
import { UsuarioService } from 'src/services/usuario.service';
import { firstValueFrom } from 'rxjs';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-sub-administrador',
  templateUrl: './sub-administrador.page.html',
  styleUrls: ['./sub-administrador.page.scss'],
})
export class SubAdministradorPage implements OnInit {
  breakActive: boolean = false;
  breakFinished: boolean = false;
  minutes: number = 15;
  seconds: number = 0;
  interval: any;

  Usuario: UsuarioResponse = {
    apell: '',
    dni: '',
    email: '',
    fecha_nac: '',
    idUsuario: 0,
    nombre: '',
    rol: '',
    telefono: '',
    usuario: ''
  };
  rol: string | null = null;
  constructor(private usSrv: UsuarioService,
    private authService: AuthService,
    private navCtrl: NavController,) { }

  async ngOnInit() {
    this.rol = this.authService.getRole();
    console.log('User role:', this.rol);  // Log para depurar
    try {
      const user = await firstValueFrom(this.usSrv.getAuthenticatedUsuario());
      this.Usuario = { ...user };
      console.log('User data:', this.Usuario); // Log user data for debugging
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      if (error.status === 401) {
        console.log('Unauthorized, redirect to login.');
        this.navCtrl.navigateRoot('/register');
      }
    }
  }

  StartBreak() {
    if (this.Usuario && this.Usuario.idUsuario) {
      this.breakActive = true;

      // Llamada al servicio para iniciar el break
      this.usSrv.startBreak(this.Usuario.idUsuario).subscribe(response => {
        if (response.success) {
          this.interval = setInterval(() => {
            if (this.seconds === 0) {
              if (this.minutes === 0) {
                this.stopBreak();
              } else {
                this.minutes--;
                this.seconds = 59;
              }
            } else {
              this.seconds--;
            }
          }, 1000);
        } else {
          console.error('Error starting break:', response.message);
        }
      });
    } else {
      console.error('User ID is undefined.');
    }
  }

  stopBreak() {
    if (this.Usuario && this.Usuario.idUsuario) {
      clearInterval(this.interval);
      this.breakActive = false;
      this.breakFinished = true;

      // Llamada al servicio para finalizar el break
      this.usSrv.stopBreak(this.Usuario.idUsuario).subscribe(response => {
        if (!response.success) {
          console.error('Error stopping break:', response.message);
        }
      });
    } else {
      console.error('User ID is undefined.');
    }
  }
}