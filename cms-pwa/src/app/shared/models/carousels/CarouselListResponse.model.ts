import { CarouselModel } from './Carousel.model';

export interface CarouselListResponseModel {
  code: number;
  status: boolean;
  message: string;
  data: CarouselModel[];
}
