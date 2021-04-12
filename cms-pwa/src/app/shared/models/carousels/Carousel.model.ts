import { CarouselItemModel } from './CarouselItem.model';
import { CarouselConfigurationModel } from './CarouselConfiguration.model';

export interface CarouselModel {
  code: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  status?: string;
  itemsDesktop?: CarouselItemModel[];
  itemsMobile?: CarouselItemModel[];
  configuration: CarouselConfigurationModel;
}
