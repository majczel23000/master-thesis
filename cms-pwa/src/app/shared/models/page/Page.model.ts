import { PageStyleModel } from './PageStyle.model';
import { PageMetaTagModel } from './PageMetaTag.model';
import { PageContentModel } from './PageContent.model';

export interface PageModel {
  code: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  status?: string;
  metaTags?: PageMetaTagModel[];
  styles?: PageStyleModel[];
  contents: PageContentModel[];
}
