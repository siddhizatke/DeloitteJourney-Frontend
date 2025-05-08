import { Routes } from '@angular/router';
import { AboutmeComponent } from './pages/aboutme/aboutme.component';
import { TrainingactivitiesComponent } from './pages/trainingactivities/trainingactivities.component';
import { TrainingselfieComponent } from './pages/trainingselfie/trainingselfie.component';
import { TeamselfieComponent } from './pages/teamselfie/teamselfie.component';

export const routes: Routes = [
  { path: '', redirectTo: 'aboutme', pathMatch: 'full' }, // Redirect default route to About Me
  { path: 'aboutme', component: AboutmeComponent },
  { path: 'trainingactivities', component: TrainingactivitiesComponent },
  { path: 'trainingselfie', component: TrainingselfieComponent },
  { path: 'teamselfie', component: TeamselfieComponent },
  { path: '**', redirectTo: 'aboutme' } // Redirect unknown routes to About Me
];


export class AppRoutingModule { }
