import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidateUsernameService implements AsyncValidator{

  constructor(private http:HttpClient) { }

  validate(control: AbstractControl<any, any>): Observable<ValidationErrors|null>{
    return this.http.get<any[]>(`http://localhost:8080/getOneUsername?username=${control.value}`)
    .pipe(
      map(resp=> (resp.length == 0) ? null: {usernameTaken: true})
    )
  }
}
