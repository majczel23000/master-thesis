import { ImageModel } from './Image.model';

export interface ImageResponseModel {
  code: number;
  status: boolean;
  message: string;
  data: ImageModel;
}
