import { CarouselModel } from './Carousel.model';

export interface CarouselResponseModel {
  code: number;
  status: boolean;
  message: string;
  data: CarouselModel;
}
