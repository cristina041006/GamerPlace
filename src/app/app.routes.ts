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
import { SellerComponent } from './auth/seller/seller.component';
import { ListGameSellerComponent } from './auth/game/listGameSeller/listGameSeller.component';
import { FormSellerComponent } from './auth/game/form-seller/form-seller.component';
import { jwtUserGuard } from './shared/guardians/jwt-user.guard';
import { jwtNoLoggedGuard } from './shared/guardians/jwt-no-logged.guard';

export const routes: Routes = [
    {
        path: "", component: StartComponent
    },
    {
        path: "videogames", component: ListComponent
    },
    {
        path: "games/:second", component: ListComponent
    },
    {
        path: "videogames/:term", component: ListComponent
    },
    {
        path: "addVideogame", component: FormComponent,
        canMatch: [jwtAdminGuard]
        
    },
    {
        path: "editVideogame/:id", component: FormComponent,
        canMatch: [jwtAdminGuard]
    },
    {
        path: "details/:id", component:DetailsComponent
    },
    {
        path: "login", component: LoginComponent,
        canMatch: [jwtNoLoggedGuard]
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
    },
    {
        path:"seller", component:SellerComponent,
        canMatch: [jwtUserGuard]
    },
    {
        path:"listGame", component: ListGameSellerComponent,
        canMatch: [jwtSellerGuard]
    },
    {
        path:"addOldGame", component:FormSellerComponent,
        canMatch: [jwtSellerGuard]
    },
    {
        path:"editOldGame/:id", component: FormSellerComponent,
        canMatch: [jwtSellerGuard]
    }
];
