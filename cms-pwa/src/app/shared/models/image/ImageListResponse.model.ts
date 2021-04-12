import { ImageModel } from './Image.model';

export interface ImageListResponseModel {
  code: number;
  status: boolean;
  message: string;
  data: ImageModel[];
}
