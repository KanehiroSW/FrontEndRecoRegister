import { Component, OnInit, ViewChild} from '@angular/core';
import { IonDatetime, IonSelect } from '@ionic/angular';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { ReportesService } from 'src/services/reportes.service';
import { DocenteResponse } from 'src/interfaces/intUsuario/DocenteResponse';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  @ViewChild('fechaInicio', { static: false }) fechaInicio!: IonDatetime;
  @ViewChild('fechaFin', { static: false }) fechaFin!: IonDatetime;
  @ViewChild('docenteSelect', { static: false }) docenteSelect!: IonSelect;

  public Docentes: DocenteResponse [] = [];

  constructor(
    private repSvc: ReportesService,
  ) { }

  ngOnInit() {
    this.repSvc.getAllDocentes()
    .subscribe(Docente => this.Docentes.push(...Docente));
  }

  verMarcaciones(){
    const fechaInicioValue = this.formatDate(this.fechaInicio.value);
    const fechaFinValue = this.formatDate(this.fechaFin.value);
    const idDocente = this.docenteSelect.value as number;

    if (fechaInicioValue && fechaFinValue) {
      if (this.validateDates(fechaInicioValue, fechaFinValue)) {
        if (idDocente === undefined || idDocente == 0) {
          this.repSvc.pdfMarcasGeneral(fechaInicioValue, fechaFinValue).subscribe((response: Blob) => {
            this.downloadBlob(response, 'reporte_marcas_general.pdf');
          }, error => {
            console.error('Error al generar el PDF:', error);
          });
        } else {
          this.repSvc.pdfMarcasUser(fechaInicioValue, fechaFinValue, idDocente).subscribe((response: Blob) => {
            this.downloadBlob(response, 'reporte_marcas_user.pdf');
          }, error => {
            console.error('Error al generar el PDF:', error);
          });
        }
      }
    } else {
      console.error('Por favor, seleccione ambas fechas');
    }
  }

  verTardanzas(){
    const fechaInicioValue = this.formatDate(this.fechaInicio.value);
    const fechaFinValue = this.formatDate(this.fechaFin.value);
    const idDocente = this.docenteSelect.value as number;

    if (fechaInicioValue && fechaFinValue) {
      if (this.validateDates(fechaInicioValue, fechaFinValue)) {
        if (idDocente === undefined || idDocente == 0) {
          this.repSvc.pdfMinTardeFecha(fechaInicioValue, fechaFinValue).subscribe((response: Blob) => {
            this.downloadBlob(response, 'reporte_min_tarde_fecha.pdf');
          }, error => {
            console.error('Error al generar el PDF:', error);
          });
        } else {
          this.repSvc.pdfMinTardeUser(fechaInicioValue, fechaFinValue, idDocente).subscribe((response: Blob) => {
            this.downloadBlob(response, 'reporte_min_tarde_user.pdf');
          }, error => {
            console.error('Error al generar el PDF:', error);
          });
        }
      }
    } else {
      console.error('Por favor, seleccione ambas fechas');
    }
  }

  verFaltas(){

  }

  private formatDate(dateStr: string | string[] | null | undefined): string {
    if (!dateStr) {
      return '';
    }
    const date = new Date(dateStr as string);
    return date.toISOString().split('T')[0];
  }

  validateDates(fechaInicio: string, fechaFin: string): boolean {
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);
  
    if (fechaInicioDate > fechaFinDate) {
      console.error('La fecha y hora de inicio no puede ser posterior a la fecha y hora de fin');
      return false;
    }
  
    return true;
  }
  
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
}


