import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {Tab1Page} from "./tab1/tab1.page";
import {Tab2Page} from "./tab2/tab2.page";

const routes: Routes = [
  { path: 'page1', component: Tab1Page, data: {animation: 'fadeIn'} },
  { path: 'page2', component: Tab2Page, data: {animation: 'slideInLeft'} },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
