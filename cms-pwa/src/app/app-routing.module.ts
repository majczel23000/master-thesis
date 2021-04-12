import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './main/login/login.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: './users/users.module#UsersModule'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'roles',
    loadChildren: './roles/roles.module#RolesModule'
  },
  {
    path: 'faqs',
    loadChildren: './faqs/faqs.module#FaqsModule'
  },
  {
    path: 'menus',
    loadChildren: './menus/menus.module#MenusModule'
  },
  {
    path: 'pages',
    loadChildren: './pages/pages.module#PagesModule'
  },
  {
    path: 'images',
    loadChildren: './images/images.module#ImagesModule'
  },
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule'
  },
  {
    path: 'dictionaries',
    loadChildren: './dictionaries/dictionaries.module#DictionariesModule'
  },
  {
    path: 'carousels',
    loadChildren: './carousels/carousels.module#CarouselsModule'
  },
  {
    path: 'error',
    component: ErrorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
