import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/authServices/auth.service';


interface Bonus {
  bonusValue: number;
  characteristic: number;
  characteristicDesc: string;
  setProficiency: number;
}
@Component({
  selector: 'app-chracters-details',
  templateUrl: './chracters-details.component.html',
  styleUrls: ['./chracters-details.component.scss']
})
export class ChractersDetailsComponent implements OnInit{
  loaded: boolean=false
  proficiency: number = 2;
  character: any;
  characterId: string = '';
  bonuses: Bonus[] = [];
  bonusesBase: Bonus[] = [];
  spells: any[] = [];
  items: any[] = [];
  abilities: any[] = [];
  showSpells: boolean = false;
  showItems: boolean = false;
  showAbilities: boolean = false;

  constructor(private route : ActivatedRoute,
      private router: Router,
      private http: HttpClient, 
      private authSV: AuthService
    ){

  }
  ngOnInit(): void {
    let result = this.route.snapshot.paramMap.get('characterId');
    if(result){
      this.characterId= result;
      this.getDetailsCahracter()
    }else{
      this.router.navigate(['/characters']);
    }


  }


  getDetailsCahracter(){
    const url = 'https://localhost:7141/api/characters/GetCharacterById';

    const queryParams: { [key: string]: string } = {};
    
    queryParams['CharacterId'] = this.characterId;

    let user = this.authSV.getUser();
    if(user){
      queryParams['UserId'] = user.id
    }

    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json' 
    });
    
    this.http.post(url, {}, { params: queryParams, headers: headers })
      .subscribe(response => {
        this.character= response;
        this.init();
      }, error => {
        this.router.navigate(['/characters']);

      });

  }


  init(){
    
    this.proficiency = this.getProficiencyBonus(this.character.level)
    this.bonuses = this.character.bonuses;
    const newArray = [];
    const targetCharacteristics = [1, 2, 3, 4, 5, 21];
    for (let i = 0; i < this.bonuses.length; i++) {
        const element = this.bonuses[i];
        if (targetCharacteristics.includes(element.characteristic)) {
            newArray.push(element);
            this.bonuses.splice(i, 1);
            i--;
        }
    }
    
    this.bonuses = this.character.bonuses;
    this.bonusesBase = newArray
    this.loaded = true;
console.log(this.character)

    
    
  }
  getSpellsCharacter(){

  }
  getAbilitiesCharacter(){

  }
  

  calculateDifference(attribute: Bonus): number {
    let diff: number = 0;
  
    if (attribute.setProficiency == 1) {
      diff = (this.proficiency + attribute.bonusValue - 10) / 2;
    } else {
      diff = (attribute.bonusValue - 10) / 2;
    }
  
    return Math.trunc(diff);
  }
  
  getCalculatedNumber(attribute: Bonus): string {
    const truncatedDiff = this.calculateDifference(attribute);
    return truncatedDiff > 0 ? '+' + truncatedDiff : truncatedDiff.toString();
  }
  
  getCalculatedNumberColor(attribute: Bonus): string {
    const diff = this.calculateDifference(attribute);
    return diff > 0 ? 'green' : diff < 0 ? 'red' : 'black';
  }
  

  updateProficiency(bonus: any) {
    bonus.setProficiency = bonus.setProficiency ? 1 : 0;
    console.log(this.bonusesBase)
  }

  getProficiencyBonus(level: number): number {
    if (level >= 1 && level <= 4) {
      return 2;
    } else if (level >= 5 && level <= 8) {
      return 3;
    } else if (level >= 9 && level <= 12) {
      return 4;
    } else if (level >= 13 && level <= 16) {
      return 5;
    } else if (level >= 17 && level <= 20) {
      return 6;
    }
    return 2; 
  }
}
