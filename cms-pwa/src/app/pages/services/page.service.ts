import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PageModel } from '../../shared/models/page/Page.model';
import { PageResponseModel } from '../../shared/models/page/PageResponse.model';
import { PageListResponseModel } from '../../shared/models/page/PageListResponse.model';
import { ModuleNavigationModel } from '../../shared/models/module-navigation/moduleNavigation.model';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  apiUrl = environment.setting.apiUrl;

  pagesNavigation: ModuleNavigationModel = {
    items: [
      {
        label: 'Pages list',
        routerLink: '/pages',
        code: 'PagesListNav'
      },
      {
        label: 'Add new page',
        routerLink: '/pages/add',
        code: 'PagesAddNav'
      }
    ]
  }

  constructor(private httpClient: HttpClient) { }

  getAllPages() {
    return this.httpClient.get<PageListResponseModel>(`${this.apiUrl}/pages`);
  }

  addPage(pageData: PageModel) {
    return this.httpClient.post<PageResponseModel>(`${this.apiUrl}/pages`, pageData);
  }

  getPageById(_id: string) {
    return this.httpClient.get<PageResponseModel>(`${this.apiUrl}/pages/${_id}`);
  }

  activatePage(_id: string) {
    return this.httpClient.post<PageResponseModel>(`${this.apiUrl}/pages/${_id}/activate`, {});
  }

  deactivatePage(_id: string) {
    return this.httpClient.post<PageResponseModel>(`${this.apiUrl}/pages/${_id}/deactivate`, {});
  }

  removePage(_id: string) {
    return this.httpClient.delete(`${this.apiUrl}/pages/${_id}`);
  }

  editPage(_id: string, pageData: PageModel) {
    return this.httpClient.put<PageResponseModel>(`${this.apiUrl}/pages/${_id}`, pageData);
  }

  getPagesNavigation(): ModuleNavigationModel {
    return this.pagesNavigation;
  }
}
