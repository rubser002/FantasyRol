import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterComponent, ToasterPlacement } from '@coreui/angular';

import { tap } from 'rxjs';
import { AuthService } from 'src/app/services/authServices/auth.service';

interface Attribute {
  name: string;
  value: number;
  enum: number;
  id?:string;
}

@Component({
  selector: 'app-chracters-new',
  templateUrl: './chracters-new.component.html',
  styleUrls: ['./chracters-new.component.scss']
})
export class ChractersNewComponent {
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  placement = ToasterPlacement.TopCenter;
  @ViewChild(MatAutocomplete) autocomplete!: MatAutocomplete;

  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  characterId: string='';
  isUpdating:boolean = false;
  characterClassControl!: FormControl;
  showRace:boolean = false;
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

  showClass: boolean= false;
  raceAbilityExists: boolean=false;
  alignmentValue!: number;
  class: any;
  classes: any;
  race: any;
  abilities: any;
  races: any;
  currentHp: number = 0;
  maxHp: number = 12;
  error: string = "";

  constructor(
    private route : ActivatedRoute,
    private formBuilder: FormBuilder,
    private authSV: AuthService,
    private http: HttpClient,
    private router: Router) {}

  async ngOnInit(): Promise<void> {
    let result = this.route.snapshot.paramMap.get('characterId');
    if(result!=null)
      this.characterId = result;


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
    if(result){
      this.getCharacter(result);
    }
  }

  getCharacter(characterId: any){
    const url = 'https://localhost:7141/api/characters/GetCharacterById';

    const queryParams: { [key: string]: string } = {};
    
    queryParams['CharacterId'] = characterId;

    let user = this.authSV.getUser();
    if(user){
      queryParams['UserId'] = user.id
    }

    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json' 
    });
    
    this.http.post(url, {}, { params: queryParams, headers: headers })
      .subscribe((response:any) => {

        this.characterForm.patchValue({
          name: response.name,
          description: response.description,
          story: response.story,
          BackgroundName: response.background.name,
          Languages: response.background.languages,
          Feature: response.background.features,
          PersonalityTrait: response.background.personalityTrait,
          Ideal: response.background.ideal,
          Bond: response.background.bond,
          Flaw: response.background.flaw,
          level: response.level,
          experiencePoints: response.experiencePoints,
          alignment: response.alignment,
          currentHitPoints: response.currentHitPoints,
          currentSpellSlots: response.currentSpellSlots,
          characterRaceId: response.characterRaceId,
          characterClassId: response.characterClassId
        });

        
        this.characterClassControl = this.characterForm.get('characterClass') as FormControl;
        this.characterClassControl.setValue(response.className);
        let classname: string = response.className
        this.classOnChange(classname);

        this.characterClassControl = this.characterForm.get('race') as FormControl;
        this.characterClassControl.setValue(response.raceName);

        
        
        let racename: string = response.raceName
        this.raceOnChange(racename);
        this.characterClassControl = this.characterForm.get('alignment') as FormControl;
        this.characterClassControl.setValue(response.alignmentDescription);
        let alignmentname: string = response.alignmentDescription

        this.alignmentOnChange(alignmentname);
        this.isUpdating = true;
        let firstArray = response.bonuses;
        
      }, error => {
        this.router.navigate(['/characters']);

      });
  }

  submitForm(): void {
    if (this.characterForm.valid) {
      const characterData = this.characterForm.value;
    }
  }

  decreaseNumber(attribute: Attribute) {
    if(!this.isUpdating)
    if (attribute.value > 0) {
      attribute.value--;
    }
  }

  increaseNumber(attribute: Attribute) {
    if(!this.isUpdating)
      if (attribute.value < 18)
      attribute.value++;
  }

  getCalculatedNumber(attribute: Attribute): string {
    const diff = (attribute.value - 10)/2;
    return diff > 0 ? '+' + diff : diff.toString();
  }

  getCalculatedNumberColor(attribute: Attribute): string {
    const diff = attribute.value - 10;
    return diff > 0 ? 'green' : diff < 0 ? 'red' : 'black';
  }

  update(){
    
    let user = this.authSV.getUser();
    const characterData = {
      id: this.characterId,
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
    
  };
    
    try{
      
         new Promise((resolve, reject) =>{
          this.http
            .post("https://localhost:7141/api/characters/UpdateCharacter",characterData)
            .subscribe((res: any)=> {
              this.router.navigate(['/character/details/',this.characterId]);
              
                resolve(res);
              },
              (err: any) => {
                reject(err);
              }
            )
        });  
      
    }catch(error){
      this.error = "Couldnt update the character"
      this.visible = !this.visible;
    }
  }

  create(){
    
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
    
    try{
      
         new Promise((resolve, reject) =>{
          this.http
            .post("https://localhost:7141/api/characters/AddCharacter",characterData)
            .subscribe((res: any)=> {
              this.addAbilities(res.toString())
                resolve(res);
              },
              (err: any) => {
                reject(err);
              }
            )
        });  
      
    }catch(error){
      this.error = "Couldnt add the character"

      this.visible = !this.visible;
    }
    
    
  }
  addAbilities(characterId: string){
    this.abilities.push(this.race.ability)
    const requestBody = {
      characterId: characterId,
      abilitiesPost: this.abilities
    };
  try{
    const url = `https://localhost:7141/api/ability/AddAbilitiesToCharacter?characterId=${characterId}`;
    const headers = new HttpHeaders()
      .set('Accept', '*/*')
      .set('Content-Type', 'application/json');

    const body = this.abilities;

    this.http.post(url, body, { headers })
      .subscribe(
        response => {
          this.router.navigate(['/home']);

        },
        error => {
          this.error = "Couldnt add the abilities"
        this.visible = !this.visible;
          
        }
      );

}catch(err){
}
    

  }

  async classOnChange(event: any){

    try{
      let selectedClassName: any;
      if(typeof event === 'string'){
        selectedClassName = event
      }else{
        selectedClassName= event.option.value;
      }

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
              this.currentHp=1
              this.showClass = true;
              
              this.maxHp=(this.class.hitDice * 2) +2
              
            },
          );
      }
    }catch(error){
    }
  
  
}

  alignmentOnChange(event: any){
    try{
      let selectedAlignmentName: any;
      if(typeof event === 'string'){
        selectedAlignmentName = event
      }else{
        selectedAlignmentName= event.option.value;
      }
      
      const selectedAlignment = this.alignmentOptions.find((c: any) => c.label === selectedAlignmentName);
    
        if (selectedAlignment) {
          
          this.alignmentValue = selectedAlignment.value;
          
        }
      
    }catch(error){

    }
  
  }

  raceOnChange(event: any)  {
    try{
      let selectedRaceName: any;
      if(typeof event === 'string'){
        selectedRaceName = event
      }else{
        selectedRaceName= event.option.value;
      }

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
              this.showRace = true;

              if(this.race.ability){
                this.raceAbilityExists= true;
              }else{
                this.raceAbilityExists= false;

              }
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


  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadData();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadData();
    }
  }

  loadData() {
    this.currentPage, this.pageSize
    
  }
}
