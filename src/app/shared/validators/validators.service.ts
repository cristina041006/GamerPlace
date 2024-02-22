import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor() { }

  completeNamePatter : string = "([A-Za-z]+) ([a-zA-z]+)"
  emailPattern:string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"; 
  phonePattern:string = "^[0-9]{9}$"; 

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
