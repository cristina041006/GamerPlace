import { Routes, CanMatchFn } from '@angular/router';
import { ListComponent } from './videogame/list/list.component';
import { FormComponent } from './videogame/form/form.component';
import { DetailsComponent } from './videogame/details/details.component';
import { LoginComponent } from './auth/login/login.component';
import { StartComponent } from './shared/start/start.component';
import { RegisterComponent } from './auth/register/register.component';
import { ShopCarComponent } from './shopCar/shop-car/shop-car.component';
import { ListBillComponent } from './bill/list-bill/list-bill.component';
import { jwtGuard } from './shared/guardians/jwt.guard';
import { jwtAdminGuard } from './shared/guardians/jwt-admin.guard';
import { jwtSellerGuard } from './shared/guardians/jwt-seller.guard';

export const routes: Routes = [
    {
        path: "", component: StartComponent
    },
    {
        path: "videogames", component: ListComponent
    },
    {
        path: "videogames/:term", component: ListComponent
    },
    {
        path: "addVideogame", component: FormComponent,
        
    },
    {
        path: "editVideogame/:id", component: FormComponent,
        canMatch: [jwtGuard, jwtAdminGuard]
    },
    {
        path: "details/:id", component:DetailsComponent
    },
    {
        path: "login", component: LoginComponent
    },
    {
        path: "register", component:RegisterComponent,
        
    },
    {
        path: "shop", component: ShopCarComponent,
        canMatch: [jwtGuard]
    },
    {
        path: "historial", component:ListBillComponent,
        canMatch: [jwtGuard]
    }
];
