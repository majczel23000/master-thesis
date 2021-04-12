import { Injectable } from '@angular/core';
import { ImageResponseModel } from '../../shared/models/image/ImageResponse.model';
import { ImageListResponseModel } from '../../shared/models/image/ImageListResponse.model';
import { ImageModel } from '../../shared/models/image/Image.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ModuleNavigationModel } from '../../shared/models/module-navigation/moduleNavigation.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  apiUrl = environment.setting.apiUrl;

  imagesNavigation: ModuleNavigationModel = {
    items: [
      {
        label: 'Images list',
        routerLink: '/images',
        code: 'ImagesListNav'
      },
      {
        label: 'Add new image',
        routerLink: '/images/add',
        code: 'ImagesAddNav'
      }
    ]
  }

  constructor(private httpClient: HttpClient) { }

  getAllImages() {
    return this.httpClient.get<ImageListResponseModel>(`${this.apiUrl}/images`);
  }

  addImage(imageData: ImageModel) {
    return this.httpClient.post<ImageResponseModel>(`${this.apiUrl}/images`, imageData);
  }

  getImageById(_id: string) {
    return this.httpClient.get<ImageResponseModel>(`${this.apiUrl}/images/${_id}`);
  }

  activateImage(_id: string) {
    return this.httpClient.post<ImageResponseModel>(`${this.apiUrl}/images/${_id}/activate`, {});
  }

  deactivateImage(_id: string) {
    return this.httpClient.post<ImageResponseModel>(`${this.apiUrl}/images/${_id}/deactivate`, {});
  }

  removeImage(_id: string) {
    return this.httpClient.delete(`${this.apiUrl}/images/${_id}`);
  }

  getImagesNavigation(): ModuleNavigationModel {
    return this.imagesNavigation;
  }
}
