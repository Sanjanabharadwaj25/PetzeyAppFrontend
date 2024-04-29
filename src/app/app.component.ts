import { Component, OnInit } from '@angular/core';
import {  NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  
  selectedLink: string = ''; 
  constructor(private router: Router) { // Inject Router here
  }
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.selectedLink = this.getLinkFromUrl(url); // Define function to extract link from URL
      }
    });
  }
  getLinkFromUrl(url: string): string {
    return url.split('/')[1]; // Assuming links are in format "/link-identifier"
  }
  title = 'PetzeyAppFrontend';

  expand: boolean = false;

  onExpand() {
    this.expand = !this.expand;
  }
  isSelected(link: string): boolean {
    return this.selectedLink === link;
}
}
