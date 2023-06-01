import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/services/authServices/auth.service';

@Component({
  selector: 'app-chracters-list',
  templateUrl: './chracters-list.component.html',
  styleUrls: ['./chracters-list.component.scss']
})
export class ChractersListComponent implements OnInit {
  

  constructor(
    private http: HttpClient, 
    private  auth: AuthService,
    private router: Router
    ){

  }
  searchName: string = "";
  characters: any;
  noCharacters: boolean = true;
  ngOnInit(): void {
    this.getCharactrs();
      
    }




getCharactrs(){
  let userId = this.auth.getUser()?.id;
    
  const url = 'https://localhost:7141/api/characters/GetListCharacters';

    
    const queryParams: { [key: string]: string } = {};
    if (userId) {
      queryParams['UserId'] = userId;
    }
    if (this.searchName) {
      queryParams['filter'] = this.searchName;
    }
    
    
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json' 
    });
    
    
    this.http.post(url, {}, { params: queryParams, headers: headers })
  .subscribe((value: Object) => {
    const response = value as any[]; // Cast the response to the expected type
    if (response && response.length > 0) {
      this.characters = response;
      this.noCharacters = false;
    }
  }, error => {
    // Handle error
  });

}


  search(){
    this.getCharactrs();
  }

  goToCharacter(id: string){

    this.router.navigate(['/character/details/'+id]);

  }
}
