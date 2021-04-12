import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RoleResponseModel } from '../../shared/models/RoleResponse.model';
import { RoleListResponseModel } from '../../shared/models/RoleListResponse.model';
import { UpdateResponseModel } from '../../shared/models/UpdateResponse.model';
import { ModuleNavigationModel } from '../../shared/models/module-navigation/moduleNavigation.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  rolesNavigation: ModuleNavigationModel = {
    items: [
      {
        label: 'Roles list',
        routerLink: '/roles',
        code: 'RolesListNav'
      }
    ]
  }

  apiUrl = environment.setting.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getAllRoles() {
    return this.httpClient.get<RoleListResponseModel>(`${this.apiUrl}/roles`);
  }

  getRoleById(_id: string) {
    return this.httpClient.get<RoleResponseModel>(`${this.apiUrl}/roles/${_id}`);
  }

  updateRole(_id: string, body) {
    return this.httpClient.put<UpdateResponseModel>(`${this.apiUrl}/roles/${_id}`, body);
  }

  activateRole(_id: string, code: string) {
    return this.httpClient.post<RoleResponseModel>(`${this.apiUrl}/roles/${_id}/activate`, {code: code});
  }

  deactivateRole(_id: string, code: string) {
    return this.httpClient.post<RoleResponseModel>(`${this.apiUrl}/roles/${_id}/deactivate`, {code: code});
  }

  getRolesNavigation(): ModuleNavigationModel {
    return this.rolesNavigation;
  }
}
