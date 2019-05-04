import { Routes, RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    {path:'',redirectTo:'welcome',pathMatch:'full'},
    {path:'welcome',component:HomeComponent},
    {path:'user',loadChildren:'./user/user.module#UserModule'},
    {path:'admin',loadChildren:'./admin/admin.module#AdminModule'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}

