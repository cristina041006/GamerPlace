import { Routes } from '@angular/router';
import { ListComponent } from './videogame/list/list.component';
import { FormComponent } from './videogame/form/form.component';
import { DetailsComponent } from './videogame/details/details.component';
import { LoginComponent } from './auth/login/login.component';
import { StartComponent } from './shared/start/start.component';

export const routes: Routes = [
    {
        path: "", component: StartComponent
    },
    {
        path: "videogames", component: ListComponent
    },
    {
        path: "addVideogame", component: FormComponent
    },
    {
        path: "editVideogame/:id", component: FormComponent
    },
    {
        path: "details/:id", component:DetailsComponent
    },
    {
        path: "login", component: LoginComponent
    }
];
