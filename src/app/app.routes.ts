import { Routes } from '@angular/router';
import { ListComponent } from './videogame/list/list.component';
import { FormComponent } from './videogame/form/form.component';
import { DetailsComponent } from './videogame/details/details.component';

export const routes: Routes = [
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
    }
];
