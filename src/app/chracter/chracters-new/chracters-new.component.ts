import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { tap } from 'rxjs';

interface Attribute {
  name: string;
  value: number;
}

@Component({
  selector: 'app-chracters-new',
  templateUrl: './chracters-new.component.html',
  styleUrls: ['./chracters-new.component.scss']
})
export class ChractersNewComponent {
  numberValue: number = 0;
  attributes: Attribute[] = [
    { name: 'Strength', value: 10 },
    { name: 'Dexterity', value: 10 },
    { name: 'Intelligence', value: 10 },
    { name: 'Wisdom', value: 10 },
    { name: 'Charisma', value: 10 }
  ];
  colorControl = new FormControl('primary' as ThemePalette);
  characterForm!: FormGroup;
  alignmentOptions: string[] = ['Lawful Good', 'Chaotic Good', 'Neutral', 'Lawful Evil', 'Chaotic Evil'];
  classes: any;
  races: any;
  constructor(private formBuilder: FormBuilder,
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
    console.log(this.classes)

    this.races = await this.http.get<any>('https://localhost:7141/api/characteristics/GetRaceAutocomplete').toPromise();

  }

  submitForm(): void {
    if (this.characterForm.valid) {
      // Perform actions when the form is submitted and valid
      const characterData = this.characterForm.value;
      console.log(characterData);
      // You can now send the character data to a service or perform any desired operations
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
    
  }
  async classOnChange(event: any){
    const selectedClass = this.classes.find((c: { label: any; })=> c.label);
   
    console.log(selectedClass)

    if (selectedClass) {
      const value = selectedClass.value;
    console.log(value)

    const url = `https://localhost:7141/api/characteristics/GetClassAbilities?classId=${value}&classLevel=${1}`;

  this.http.post(url, {}).subscribe(
    (response) => {
      // Handle the successful response here
      console.log(response);
    },
    (error) => {
      // Handle the error here
      console.error(error);
    }
  );
  }
  }
 



  raceOnChange(event: any)  {

  }
}
