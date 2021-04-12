import { Injectable } from '@angular/core';
import { CarouselListResponseModel } from '../../shared/models/carousels/CarouselListResponse.model';
import { CarouselResponseModel } from '../../shared/models/carousels/CarouselResponse.model';
import { CarouselModel } from '../../shared/models/carousels/Carousel.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ModuleNavigationModel } from '../../shared/models/module-navigation/moduleNavigation.model';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  apiUrl = environment.setting.apiUrl;

  carouselsNavigation: ModuleNavigationModel = {
    items: [
      {
        label: 'Carousels list',
        routerLink: '/carousels',
        code: 'CarouselsListNav'
      },
      {
        label: 'Add new carousel',
        routerLink: '/carousels/add',
        code: 'CarouselsAddNav'
      }
    ]
  };

  constructor(private httpClient: HttpClient) { }

  getAllCarousels() {
    return this.httpClient.get<CarouselListResponseModel>(`${this.apiUrl}/carousels`);
  }

  addCarousel(carouselData: CarouselModel) {
    return this.httpClient.post<CarouselResponseModel>(`${this.apiUrl}/carousels`, carouselData);
  }

  getCarouselById(_id: string) {
    return this.httpClient.get<CarouselResponseModel>(`${this.apiUrl}/carousels/${_id}`);
  }

  activateCarousel(_id: string) {
    return this.httpClient.post<CarouselResponseModel>(`${this.apiUrl}/carousels/${_id}/activate`, {});
  }

  deactivateCarousel(_id: string) {
    return this.httpClient.post<CarouselResponseModel>(`${this.apiUrl}/carousels/${_id}/deactivate`, {});
  }

  removeCarousel(_id: string) {
    return this.httpClient.delete(`${this.apiUrl}/carousels/${_id}`);
  }

  editCarousel(_id: string, carouselData) {
    return this.httpClient.put<CarouselResponseModel>(`${this.apiUrl}/carousels/${_id}`, carouselData);
  }

  getCarouselsNavigation(): ModuleNavigationModel {
    return this.carouselsNavigation;
  }
}
