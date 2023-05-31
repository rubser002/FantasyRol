import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ToasterComponent, ToasterPlacement } from '@coreui/angular';

import { tap } from 'rxjs';
import { AuthService } from 'src/app/services/authServices/auth.service';

interface Attribute {
  name: string;
  value: number;
  enum: number;
}

@Component({
  selector: 'app-chracters-new',
  templateUrl: './chracters-new.component.html',
  styleUrls: ['./chracters-new.component.scss']
})
export class ChractersNewComponent {
  placement = ToasterPlacement.TopCenter;

  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  numberValue: number = 0;
  attributes: Attribute[] = [
    { name: 'Strength', value: 10 , enum: 1},
    { name: 'Dexterity', value: 10 , enum: 2},
    { name: 'Constitution', value: 10 , enum: 21},
    { name: 'Intelligence', value: 10 , enum: 3},
    { name: 'Wisdom', value: 10 , enum: 4},
    { name: 'Charisma', value: 10, enum: 5}
  ];

  colorControl = new FormControl('primary' as ThemePalette);
  characterForm!: FormGroup;
  alignmentOptions = [
    { label: 'Lawful Good', value: 1 },
    { label: 'Neutral Good', value: 2 },
    { label: 'Chaotic Good', value: 3 },
    { label: 'Lawful Neutral', value: 4 },
    { label: 'True Neutral', value: 5 },
    { label: 'Chaotic Neutral', value: 6 },
    { label: 'Lawful Evil', value: 7 },
    { label: 'Neutral Evil', value: 8 },
    { label: 'Chaotic Evil', value: 9 }
  ];


  
  alignmentValue!: number;
  class: any;
  classes: any;
  race: any;
  abilities: any;
  races: any;
  currentHp: number = 0;
  maxHp: number = 12;

  constructor(
    private formBuilder: FormBuilder,
    private authSV: AuthService,
    private http: HttpClient) {}

  async ngOnInit(): Promise<void> {



    this.characterForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      story: [''],
      alignment: [''],
      BackgroundName: [''],
      Feature: [''],
      PersonalityTrait: [''],
      Ideal: [''],
      Bond: [''],
      Flaw: [''],
      Languages: [''],
      characterClass: ['', Validators.required],
      race: ['', Validators.required],
    });


    this.classes = await this.http.get<any>('https://localhost:7141/api/characteristics/GetClassAutocomplete').toPromise();

    this.races = await this.http.get<any>('https://localhost:7141/api/characteristics/GetRaceAutocomplete').toPromise();

  }

  submitForm(): void {
    if (this.characterForm.valid) {
      const characterData = this.characterForm.value;
    }
  }

  decreaseNumber(attribute: Attribute) {
    if (attribute.value > 0) {
      attribute.value--;
    }
  }

  increaseNumber(attribute: Attribute) {
    attribute.value++;
  }

  getCalculatedNumber(attribute: Attribute): string {
    const diff = attribute.value - 10;
    return diff > 0 ? '+' + diff : diff.toString();
  }

  getCalculatedNumberColor(attribute: Attribute): string {
    const diff = attribute.value - 10;
    return diff > 0 ? 'green' : diff < 0 ? 'red' : 'black';
  }

  create(){
    this.visible = !this.visible;
    let bonuses: any[] = []; 
    this.attributes.forEach(element => {
      let bonus = {
        bonusValue: element.value,
        setProficiency: null,
        characteristic: element.enum
      };
      bonuses.push(bonus);
    });


    let user = this.authSV.getUser();
    const characterData = {
      name: this.characterForm.value.name || '',
      description: this.characterForm.value.description || null,
      story: this.characterForm.value.story || null,
      level: 1,
      experiencePoints: 0,
      alignment: this.alignmentValue,
      currentHitPoints: this.currentHp || null,
      currentSpellSlots: "",
      userId: user?.id , 
      characterRaceId: this.race.id,
      characterClassId: this.class.id,
      subclassId: null, 
      background: {
        name: this.characterForm.value.BackgroundName,
        languages: this.characterForm.value.Languages || null,
        features: this.characterForm.value.Feature || null,
        personalityTrait: this.characterForm.value.PersonalityTrait || null,
        ideal: this.characterForm.value.Ideal || null,
        bond: this.characterForm.value.Bond || null,
        flaw: this.characterForm.value.Flaw || null
    },
    bonuses: bonuses.length > 0 ? bonuses : []
  };

    const requestBody = {
      characterPostDto: characterData
    };
  
    try{
      this.http.post<any>('https://localhost:7141/api/characters/AddCharacter', characterData).pipe(
          
      ).subscribe();
    }catch(error){
      this.visible = !this.visible;
    }
    
    
  }


  async classOnChange(event: any){
    try{
      const selectedClassName = event.option.value;

      const selectedClass = this.classes.find((c: any) => c.label === selectedClassName);
    
        if (selectedClass) {
          const value = selectedClass.value;
        
          const classLevel = 1;
        
          const requestBody = {}; 
        
          this.http.post('https://localhost:7141/api/ability/GetAbilitiesFromClass', requestBody, {
            params: {
              classId: value,
              lvl: classLevel.toString()
            },
            headers: {
              'accept': '*/*'
            }
          }).subscribe(
            (response) => {
              this.abilities = response;
              
            },
          );
          this.http.post('https://localhost:7141/api/class/GetClassById', requestBody, {
            params: {
              Id: value,
            },
            headers: {
              'accept': '*/*'
            }
          }).subscribe(
            (response) => {
              this.class = response;
              
              
              this.maxHp=(this.class.hitDice * 2) +2
              
            },
          );
      }
    }catch(error){
    }
  
  
}

  alignmentOnChange(event: any){
    try{
      const selectedAlignmentName = event.option.value;

      const selectedAlignment = this.alignmentOptions.find((c: any) => c.label === selectedAlignmentName);
    
        if (selectedAlignment) {
          
          this.alignmentValue = selectedAlignment.value;
        }
      
    }catch(error){

    }
  
  }

  raceOnChange(event: any)  {
    try{
      const selectedRaceName = event.option.value;

      const selectedRace = this.races.find((c: any) => c.label === selectedRaceName);
    
        if (selectedRace) {
          const value = selectedRace.value;
        
          const requestBody = {}; 
        
          this.http.post('https://localhost:7141/api/characteristics/GetRaceById', requestBody, {
            params: {
              Id: value,
            },
            headers: {
              'accept': '*/*'
            }
          }).subscribe(
            (response) => {
              this.race = response;
              
            },
          );
          
      }
    }catch(error){
    }
  }
  checkClassAbilities(){
    if(this.abilities && this.abilities.length > 0){
      return true;
    }
    return false;
  }



  // toast 
  position = 'top-end';
  visible = false;
  percentage = 0;

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
}
