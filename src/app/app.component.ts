import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginPageComponent } from "./login-page/login-page.component";
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginPageComponent, NgFor, FormsModule],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  title = 'LoginApp';
}
