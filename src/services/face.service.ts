import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaceService {
  private baseUrl = 'http://127.0.0.1:5000'; // Reemplaza con tu URL y puerto

  constructor(private http: HttpClient) { }

  facialLogin(imageData: string): Observable<any> {
    const url = `${this.baseUrl}/facial_login`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = { image: imageData };

    return this.http.post(url, body, { headers });
  }

  marcarEntrada(idUsuario: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/marcar_entrada`, { idUsuario });
  }

  marcarSalida(idUsuario: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/marcar_salida`, { idUsuario });
  }
}