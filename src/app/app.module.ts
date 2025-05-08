/* import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app.routes'; // Import your routing module

// Import your components here
import { MainpageComponent } from './pages/mainpage/mainpage.component';
import { AboutmeComponent } from './pages/aboutme/aboutme.component';
import { TrainingactivitiesComponent } from './pages/trainingactivities/trainingactivities.component';
import { TrainingselfieComponent } from './pages/trainingselfie/trainingselfie.component';
import { TeamselfieComponent } from './pages/teamselfie/teamselfie.component';

@NgModule({
  declarations: [
  ],
  imports: [
    AppComponent,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule,
    FormsModule,
    RouterModule,
    CommonModule,
    AppComponent,
    MainpageComponent,
    AboutmeComponent,
    TrainingactivitiesComponent,
    TrainingselfieComponent,
    TeamselfieComponent
  ],
  providers: [],
  // Removed bootstrap array as AppComponent is a standalone component
})
export class AppModule { }
 */