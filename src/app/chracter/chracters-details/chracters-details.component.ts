import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/authServices/auth.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

interface Ability{
  id:string;
  name:string;
  description:string;
  editable:boolean;
}

interface Bonus {
  id:string;
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
  showNewAbilityForm: boolean = false;
  newAbility: any = {
    name: '',
    description: ''
  };
  tempName: string = '';
  tempDescription: string = '';
  error:string='';
  position = 'top-end';
  visible = false;
  percentage = 0;
  loaded: boolean=false
  proficiency: number = 2;
  character: any;
  characterId: string = '';
  bonuses: Bonus[] = [];
  bonusesBase: Bonus[] = [];
  spells: any[] = [];
  items: any[] = [];
  abilities: Ability[] = [];
  showSpells: boolean = false;
  showItems: boolean = false;
  showAbilities: boolean = false;
  class: any;
  race:any;

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
    const url = 'https://localhost:7141/api/characters/GetCharacterDetailsById';

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

  toggleEditability(ability: any) {
    if (ability.editable) {
      this.updateAbility(ability);
      
    }
    ability.editable = !ability.editable;
  }
  


  updateAbility(ability: any){
    
  try{
    const url = `https://localhost:7141/api/ability/UpdateAbilities?characterId=${this.character.id}`;
    const headers = new HttpHeaders()
      .set('Accept', '*/*')
      .set('Content-Type', 'application/json');

    const body = [ability];

    this.http.post(url, body, { headers })
      .subscribe(
        response => {
          

        },
        error => {
          this.error = "Couldnt add the ability"
        this.visible = !this.visible;
          
        }
      );
  }catch(err){
    this.error = "Couldnt add the ability"
    this.visible = !this.visible;
  }
  }

  init(){
    
    this.proficiency = this.getProficiencyBonus(this.character.level)
    this.bonuses = this.character.bonuses;
    this.abilities = this.character.abilitiesMini;

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

  onTabChange(event: MatTabChangeEvent): void {
    const selectedIndex = event.index;
    
    if (selectedIndex === 1) {
      
      
    } else if (selectedIndex === 2) {
      
      
    }
  }
  
  

  save(){
    const url = `https://localhost:7141/api/characters/UpdateBonuses`;

    const headers = new HttpHeaders()
      .set('Accept', '*/*')
      .set('Content-Type', 'application/json');

      const body = [...this.bonuses, ...this.bonusesBase];
    this.http.post(url, body, { headers })
      .subscribe(
        response => {
          

        },
        error => {
          this.error = "Couldnt save bonuses"
          this.toggleToast()
          
        }
      );
  }
  
  
  
  
  

  toggleToast() {
    this.visible = !this.visible;
  }

  onVisibleChange($event: boolean) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  onTimerChange($event: number) {
    this.percentage = $event * 25;
  }

  toggleNewAbility() {
    this.showNewAbilityForm = !this.showNewAbilityForm;
  }
  
  saveNewAbility() {
    this.saveNewAbilityToHttp(this.newAbility);
   
    
    this.newAbility = {
      name: '',
      description: ''
    };
    this.showNewAbilityForm = false;
  }
  
  cancelNewAbility() {
    
    this.newAbility = {
      name: '',
      description: ''
    };
    this.showNewAbilityForm = false;
  }
 
  saveNewAbilityToHttp(ability:any){
    
  try{
    const url = `https://localhost:7141/api/ability/AddAbilitiesToCharacter?characterId=${this.character.id}`;
    const headers = new HttpHeaders()
      .set('Accept', '*/*')
      .set('Content-Type', 'application/json');

    const body = [ability];

    this.http.post(url, body, { headers })
      .subscribe(
        response => {
          this.getDetailsCahracter();

        },
        error => {
          this.error = "Couldnt add the abilities"
        this.visible = !this.visible;
          
        }
      );
  }catch{
    this.error = "Couldnt add the abilities"
        this.visible = !this.visible;
  }
}
    editCharacter(){
      this.router.navigate(['character/edit/',this.characterId]);
    }
  
  
}
