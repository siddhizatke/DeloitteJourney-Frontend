import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routes';
import { AboutmeComponent } from "./pages/aboutme/aboutme.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, RouterLink,RouterLinkActive]
})
export class AppComponent {
  title = 'MyDeloitteJourney';

  someRecursiveFunction() {
    this.someRecursiveFunction(); // This will cause a stack overflow
}
}
