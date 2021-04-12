import { Injectable } from '@angular/core';
import { DictionaryModel } from '../../shared/models/dictionary/Dictionary.model';
import { DictionaryResponseModel } from '../../shared/models/dictionary/DictionaryResponse.model';
import { DictionaryListResponseModel } from '../../shared/models/dictionary/DictionaryListResponse.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ModuleNavigationModel } from '../../shared/models/module-navigation/moduleNavigation.model';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  apiUrl = environment.setting.apiUrl;

  dictionariesNavigation: ModuleNavigationModel = {
    items: [
      {
        label: 'Dictionaries list',
        routerLink: '/dictionaries',
        code: 'DictionariesListNav'
      },
      {
        label: 'Add new dictionary',
        routerLink: '/dictionaries/add',
        code: 'DictionariesAddNav'
      }
    ]
  };

  constructor(private httpClient: HttpClient) { }

  getAllDictionaries() {
    return this.httpClient.get<DictionaryListResponseModel>(`${this.apiUrl}/dictionaries`);
  }

  addDictionary(faqData: DictionaryModel) {
    return this.httpClient.post<DictionaryResponseModel>(`${this.apiUrl}/dictionaries`, faqData);
  }

  getDictionaryById(_id: string) {
    return this.httpClient.get<DictionaryResponseModel>(`${this.apiUrl}/dictionaries/${_id}`);
  }

  activateDictionary(_id: string) {
    return this.httpClient.post<DictionaryResponseModel>(`${this.apiUrl}/dictionaries/${_id}/activate`, {});
  }

  deactivateDictionary(_id: string) {
    return this.httpClient.post<DictionaryResponseModel>(`${this.apiUrl}/dictionaries/${_id}/deactivate`, {});
  }

  removeDictionary(_id: string) {
    return this.httpClient.delete(`${this.apiUrl}/dictionaries/${_id}`);
  }

  editDictionary(_id: string, faqData) {
    return this.httpClient.put<DictionaryResponseModel>(`${this.apiUrl}/dictionaries/${_id}`, faqData);
  }

  getDictionariesNavigation(): ModuleNavigationModel {
    return this.dictionariesNavigation;
  }
}
