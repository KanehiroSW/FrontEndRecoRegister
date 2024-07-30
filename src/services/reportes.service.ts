import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocenteResponse } from 'src/interfaces/intUsuario/DocenteResponse';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private urlbase = 'http://localhost:5000/';

  constructor(private http: HttpClient) { }

  getAllDocentes(): Observable<DocenteResponse[]>{
    return this.http.get<DocenteResponse[]>
    (`${this.urlbase}/all_docentes`);
  }

  pdfMarcasGeneral(fechaInicio: string, fechaFin: string): Observable<Blob>{
    const body = {
      ini_date: fechaInicio,
      fin_date: fechaFin      
    };

    return this.http.post(`${this.urlbase}/marcas_general`, body, { responseType: 'blob' });
  }

  pdfMarcasUser(fechaInicio: string, fechaFin: string, idUsuario: number): Observable<Blob> {
    const body = {
      ini_date: fechaInicio,
      fin_date: fechaFin,
      idUser: idUsuario
    };
    return this.http.post(`${this.urlbase}/marcas_user`, body, { responseType: 'blob' });
  }

  pdfMinTardeFecha(fechaInicio: string, fechaFin: string): Observable<Blob>{
    const body = {
      ini_date: fechaInicio,
      fin_date: fechaFin      
    };

    return this.http.post(`${this.urlbase}/minutos_tarde_fecha`, body, { responseType: 'blob' });
    
  }

  pdfMinTardeUser(fechaInicio: string, fechaFin: string, idUsuario: number): Observable<Blob> {
    const body = {
      ini_date: fechaInicio,
      fin_date: fechaFin,
      idUser: idUsuario
    };
    return this.http.post(`${this.urlbase}/minutos_tarde_user`, body, { responseType: 'blob' });

  }

}
