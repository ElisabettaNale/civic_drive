import { Routes } from '@angular/router'; 
import { LoginComponent } from './pages/login/login.component';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { UsersPostsComponent } from './pages/users-posts/users-posts.component';
import { UsersListIdComponent } from './pages/users-list-id/users-list-id.component';

export const routes: Routes = [{
    path: '',
    pathMatch: 'full',
    component: LoginComponent
},
{
    path: 'users-list',
    pathMatch: 'full',
    component: UsersListComponent
},
{
    path: 'users-list/:id',
    pathMatch: 'full',
    component: UsersListIdComponent
},
{
    path: 'users-posts',
    pathMatch: 'full',
    component: UsersPostsComponent
}];
