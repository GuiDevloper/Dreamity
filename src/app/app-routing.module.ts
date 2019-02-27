import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { ProfileComponent } from './profile/profile.component';
import { PostsComponent } from './posts/posts.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'about', component: AboutComponent},
  // {path: 'login', component: LoginComponent},
  {path: ':user', component: ProfileComponent},
  {path: ':profile/p/:dream', component: PostsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
