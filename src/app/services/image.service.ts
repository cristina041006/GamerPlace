import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cloudinary } from '@cloudinary/url-gen';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
/**Servicio donde controlaremos la logica de las imagenes */

  constructor(private http:HttpClient) { }
  unsignedUploadPreset : string = 'qpfrvwru';
  cloudName : string = 'ddyvcopgh';

  /**
   * Metodo para subir una imagen a cloudinary
   * @param field 
   * @returns 
   */
  uploadFile(field: string){
    const formData: FormData = new FormData()
    formData.append('file', field)
    formData.append('upload_preset', this.unsignedUploadPreset)
    return this.http.post<any>(`https://api.cloudinary.com/v1_1/${this.cloudName}/upload`, formData)

  }
}
