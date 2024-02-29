import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
/**Servicio donde estaran las validaciones mas especificas que queremos hacer */
  constructor() { }

  //Patter del nombre de uauruario
  completeNamePatter : string = "([A-Za-z]+) ([a-zA-z]+)"
  //Patter del email
  emailPattern:string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"; 
  //Patter del telefono
  phonePattern:string = "^[0-9]{9}$"; 
  //Patter del password
  passwordPattern:string = "^(?=.*[A-Z])(?=.*\\d).{8,}$"; 

  /**
   * Metodo para comprbar si dos campos son iguales, si no lo son devuelve un error 
   * @param field1 
   * @param field2 
   * @returns 
   */
  equalsFields(field1:string, field2:string): ValidatorFn{
    return (formControl: AbstractControl): ValidationErrors | null => {
      const control2 = formControl.get(field2);
      const field1Input : string = formControl.get(field1)?.value;
      const field2Input : string = formControl.get(field2)?.value;
      
      if(field1Input !== field2Input){
        control2?.setErrors({nonEquals:true})
        return {notEqualsFields:true}
      }
      if(control2?.errors && control2.hasError("nonEquals")){
        delete control2.errors["nonEquals"];
        control2.updateValueAndValidity();
      }

      return null;
    }
  }

}
