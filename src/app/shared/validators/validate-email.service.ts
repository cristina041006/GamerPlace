import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidateEmailService implements AsyncValidator{
/**Servicio que usaremos para validar que el email de un uaurio no exista en la base de datos al momento de añadirlo */

  constructor(private http:HttpClient) { }


  /**
   * Metodo para hacer la peticion y comporbar si hay usuarios con ese email, si hay devuelve un error si no hya devuelve null
   * @param control 
   * @returns 
   */
  validate(control: AbstractControl<any, any>): Observable<ValidationErrors|null>{
    return this.http.get<any[]>(`https://proyectoapi-cristina041006.onrender.com/existEmail?email=${control.value}`)
    .pipe(
      map(resp=> (resp.length == 0) ? null: {emailTaken: true})
    )
  }

}
