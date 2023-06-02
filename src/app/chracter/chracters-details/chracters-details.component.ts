import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/services/authServices/auth.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SpellMiniDTO } from 'src/shared/SpellMiniDto';
import { MatTableDataSource } from '@angular/material/table';

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
export class ChractersDetailsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false })

  

  currentPage:number = 1;
  nameFilter = '';
  levelFilter = '';
  schoolFilter = '';
  descriptionFilter = '';
  paginator!: MatPaginator;
  dataSource!: MatTableDataSource<any>;
  dataSourceCharacter!: MatTableDataSource<any>;
  currentPageCharacter = 1;
  nameFilterCharacter = '';
  levelFilterCharacter = '';
  schoolFilterCharacter = '';
  descriptionFilterCharacter = '';
  totalItemsCharacter = 0;
  maxSizeCharacter = 5;
  totalItems = 0;
  maxSize = 5;
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
  visibleSave = false;
  percentage = 0;
  percentageSave = 0;

  loaded: boolean=false
  proficiency: number = 2;
  character: any;
  characterId: string = '';
  bonuses: Bonus[] = [];
  bonusesBase: Bonus[] = [];
  spells: SpellMiniDTO[] = [];
  spellsCharacter: SpellMiniDTO[] = [];

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
      private authSV: AuthService,
      private cdr: ChangeDetectorRef,
    ){

  }
  ngOnInit(): void {
console.log(this.currentPage);

    let result = this.route.snapshot.paramMap.get('characterId');
    if (result) {
      console.log('e',this.currentPage)
      this.characterId = result;
      this.getDetailsCahracter();
      

      // After the asynchronous operations, manually trigger change detection
      this.cdr.detectChanges();
    } else {
      this.router.navigate(['/characters']);
    }
console.log(this.currentPage);
    
  }


  getDetailsCahracter(){
    console.log('d',this.currentPage)

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
    console.log('f',this.currentPage)
    
    this.http.post(url, {}, { params: queryParams, headers: headers })
      .subscribe(response => {
        this.currentPage=1
    
        
          this.character = response;
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
    console.log('b',this.currentPage)

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
    console.log('a',this.currentPage)
    this.loadSpells();
      this.loadSpellsCharacter();
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
          this.visibleSave = !this.visibleSave

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

  onVisibleSaveChange($event: boolean) {
    this.visibleSave = $event;
    this.percentageSave = !this.visible ? 0 : this.percentage;
  }

  onTimerSaveChange($event: number) {
    this.percentageSave = $event * 25;
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
    loadSpells() {

      const requestBody = {};
      
      console.log(this.currentPage)
      const params = new HttpParams()
        .set('pageSize', 10)
        .set('currentPage', this.currentPage.toString())
        .set('filter', this.nameFilter)
        .set('level', this.levelFilter)
        .set('school', this.schoolFilter)
        .set('description', this.descriptionFilter);
  
      this.http.post<any>('https://localhost:7141/api/spell/GetSpells', requestBody, {
        params,
        headers: {
          'accept': '*/*'
        }
      }).subscribe(
        (response) => {
          console.log(response);
          this.spells= response.results
          this.totalItems= response.totalCount
          this.dataSource = new MatTableDataSource(response.results);
          

        },
      );
    }

    loadSpellsCharacter() {
      try{

        const requestBody = {};
        
        const params = new HttpParams()
          .set('characterId', this.characterId)
          .set('pageSize', 10)
          .set('currentPage', this.currentPageCharacter.toString())
          .set('filter', this.nameFilterCharacter)
          .set('level', this.levelFilterCharacter)
          .set('school', this.schoolFilterCharacter)
          .set('description', this.descriptionFilterCharacter);
    
        this.http.post<any>('https://localhost:7141/api/spell/GetSpellsCharacter', requestBody, {
          params,
          headers: {
            'accept': '*/*'
          }
        }).subscribe(
          (response) => {
            console.log(response);
            this.spellsCharacter= response.results
            this.totalItemsCharacter= response.totalCount
            this.dataSourceCharacter = new MatTableDataSource(response.results);
          },
        );
      }catch(error){
        console.log(error)
      }
      
    }

    getPages(): number[] {
      const totalPages = this.getTotalPages();
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    getPagesCharacter(): number[] {
      const totalPages = this.getTotalPages();
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    
    getTotalPages(): number {
      return Math.ceil(this.totalItems / 10);
    }
    getTotalPagesCharacter(): number {
      return Math.ceil(this.totalItemsCharacter / 10);
    }
    
    goToPage(page: number): void {
      if (page >= 1 && page <= this.getTotalPages()) {
        this.currentPage = page;
        this.loadSpells();
      }
    }
    goToPageCharacter(page: number): void {
      if (page >= 1 && page <= this.getTotalPagesCharacter()) {
        this.currentPage = page;
        this.loadSpellsCharacter();
      }
    }
    
    goToPreviousPage(): void {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.loadSpells();
      }
    }
    goToPreviousPageCharacter(): void {
      if (this.currentPageCharacter > 1) {
        this.currentPageCharacter--;
        this.loadSpellsCharacter();
      }
    }
    
    goToNextPage(): void {
      if (this.currentPage < this.getTotalPages()) {
        this.currentPage++;
        this.loadSpells();
      }
    }
    goToNextPageCharacter(): void {
      if (this.currentPageCharacter < this.getTotalPages()) {
        this.currentPageCharacter++;
        this.loadSpellsCharacter();
      }
    }
    applyFilters() {
      
      this.currentPage = 1;
      this.loadSpells();
    }
    applyFiltersCharacter() {
      
      this.currentPageCharacter = 1;
      this.loadSpellsCharacter();
    }
    onPageChange(event: PageEvent) {
      this.currentPage = event.pageIndex + 1;
      
      this.loadSpells();
    }
    onPageChangeCharacter(event: PageEvent) {
      this.currentPageCharacter = event.pageIndex + 1;
      
      this.loadSpellsCharacter();
    }
    getTotalItems(): number {
      console.log(this.totalItems)

      return this.totalItems
    }
    getTotalItemsCharacter(): number {
      console.log(this.totalItemsCharacter)
      return this.totalItemsCharacter
    }
    saveSpell(spell:any ){
      const requestBody = {};
      const params = new HttpParams()
        .set('characterId', this.characterId)
        .set('spellId', spell.id)
        
  
      this.http.post<any>('https://localhost:7141/api/spell/AddSpellCharacter', requestBody, {
        params,
        headers: {
          'accept': '*/*'
        }
      }).subscribe(
        () => {
          this.spellsCharacter.push(spell)
          

        },
      );
    }
    deleteSpell(spell:any){
      const requestBody = {};
      const params = new HttpParams()
        .set('characterId', this.characterId)
        .set('spellId', spell.id)
        
  
      this.http.post<any>('https://localhost:7141/api/spell/DeleteSpellCharacter', requestBody, {
        params,
        headers: {
          'accept': '*/*'
        }
      }).subscribe(
        () => {
          const index = this.spellsCharacter.indexOf(spell);
          if (index !== -1) {
            this.spellsCharacter.splice(index, 1);
              }
        },
      );


      
    }
}
