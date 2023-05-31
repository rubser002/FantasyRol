import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AuthService, User } from '../services/authServices/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';

interface Tab {
  label: string;
  route: string;
  selected: boolean;
  active: boolean;
}
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent {
  tabs: Tab[] = [
    { label: 'Home', route: '/home', selected: false ,active: false },
    { label: 'Characters', route: '/characters', selected: false , active: false },
    { label: 'New', route: '/character/new', selected: false ,active: false },

  ];

  user: User = new User;
  constructor(
    private readonly authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ){}

  ngOnInit() {
    let user = this.authService.getUser();
  if (user) {
    this.user = user;
  }
    let currentTab = this.tabs.find(w => w.route === this.router.url);

    if(currentTab){
      currentTab.active = true;
    }
  }
  
  isActiveTab(link: string): boolean {
    return this.router.isActive(link, true);
  }
  
  navigateToPage(route: string) {
    this.router.navigateByUrl(route);
    
  }
  onTabChange(event: MatTabChangeEvent) {
    const selectedTabIndex = event.index;
  
    this.tabs.forEach((tab, index) => {
      tab.active = index === selectedTabIndex;
    });
  
    const selectedTab = this.tabs[selectedTabIndex];
    const route = selectedTab.route;
    this.router.navigate([route]);

  }

  onTabCLick(tabD: any){
    this.tabs.forEach((tab, index) => {
      tab.active = tab === tabD;
    });
    
    this.router.navigate([tabD.route]);
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
