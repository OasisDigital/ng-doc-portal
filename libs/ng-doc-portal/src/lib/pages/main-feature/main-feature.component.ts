import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SideNavComponent, ToolbarComponent } from '../../components';

@Component({
  selector: 'ngdp-main-feature',
  standalone: true,
  templateUrl: './main-feature.component.html',
  imports: [RouterOutlet, ToolbarComponent, SideNavComponent],
})
export class MainFeatureComponent {}
