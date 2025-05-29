import { Routes } from '@angular/router';
import { AboutmeComponent } from './pages/aboutme/aboutme.component';
import { TrainingactivitiesComponent } from './pages/trainingactivities/trainingactivities.component';
import { TrainingselfieComponent } from './pages/trainingselfie/trainingselfie.component';
import { TeamselfieComponent } from './pages/teamselfie/teamselfie.component';
import { LoginComponent } from './pages/login/login.component';
import { FirstPageComponent } from './pages/first-page/first-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'FirstPage', pathMatch: 'full' }, // Redirect default route to About Me
  { path: 'aboutme', component: AboutmeComponent },
  { path:   'login', component:LoginComponent},
  { path: 'trainingactivities', component: TrainingactivitiesComponent },
  { path: 'trainingselfie', component: TrainingselfieComponent },
  { path: 'teamselfie', component: TeamselfieComponent },
  { path: 'FirstPage', component: FirstPageComponent },
  { path: '**', redirectTo: 'aboutme' } // Redirect unknown routes to About Me
];


export class AppRoutingModule { }
