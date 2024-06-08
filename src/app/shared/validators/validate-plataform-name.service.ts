import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidatePlataformNameService implements AsyncValidator {
  /**Servicio de validacion para comprobar que el nombre de la categoria que estamos añadiendo y
   * editando no existe
   */
  constructor(private http:HttpClient) { }


  /**
   * Metodo para hacer la peticion y comporbar si hay categoruas con ese nombre, si hay devuelve un error si no hya devuelve null
   * @param control 
   * @returns 
   */
  validate(control: AbstractControl<any, any>): Observable<ValidationErrors|null>{
    return this.http.get<any[]>(`https://proyectoapi-cristina041006.onrender.com/foundPlataform?namePlataform=${control.value}`)
    .pipe(
      map(resp=>(resp.length == 0) ? null: {namePlataformTaken: true})
      
    )
  }
}
