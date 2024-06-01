import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-home',
  templateUrl: './main-home.component.html',
  styleUrl: './main-home.component.css',
})
export class MainHomeComponent implements OnInit {
  /*--------------------------------------------------------------------*/
  isLoggedIn: boolean = false;
  /*--------------------------------------------------------------------*/
  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }
  /*--------------------------------------------------------------------*/
}
