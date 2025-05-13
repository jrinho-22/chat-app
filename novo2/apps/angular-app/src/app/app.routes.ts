import { Route } from '@angular/router';
import { HomeComponent } from './views/home.component';
import { PageComponent } from './page/page.component';

export const appRoutes: Route[] = [
    {path: "**", redirectTo: "main"},
    {path: "main", component: PageComponent}
];
