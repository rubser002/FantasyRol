import {Component, Input, OnInit} from '@angular/core';

import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],

})
export class LayoutComponent implements OnInit {
  @Input()user!: string;

  ngOnInit(): void {
    
  }

  
}
