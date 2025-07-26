import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet],
  standalone: true,
  })
export class AppComponent {
  title = 'user-directory-dashboard';
}
