import { Routes } from '@angular/router';
import { AssignmentsComponent } from './assignments/assignments.component';
import { AddAssignmentComponent } from './assignments/add-assignment/add-assignment.component';
import { NavigationErrorComponent } from './navigation-error-component/navigation-error-component.component';
import { AssignmentDetailComponent } from './assignments/assignment-detail/assignment-detail.component';
import { EditAssignmentComponent } from './assignments/edit-assignment/edit-assignment.component';
import { authGuard } from './shared/auth.guard';
import { StatsComponent } from './stats/stats.component';
import { MatieresComponent } from './matieres/matieres.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'home', component: AssignmentsComponent, canActivate: [authGuard]},
    {path: 'add', component: AddAssignmentComponent, canActivate: [authGuard]},
    {path: 'assignments/:id', component: AssignmentDetailComponent, canActivate: [authGuard]},
    {path: 'assignments/:id/edit', component: EditAssignmentComponent, canActivate: [authGuard]},
    {path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
    {path: 'stats', component: StatsComponent, canActivate: [authGuard]},
    {path: 'matieres', component: MatieresComponent, canActivate: [authGuard]},
    {path: '**', component:NavigationErrorComponent}
];
