import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';

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
  classOptions: string[] = ['Warrior', 'Mage', 'Rogue', 'Cleric']; // Example class options
  raceOptions: string[] = ['Human', 'Elf', 'Dwarf', 'Orc']; // Example race options
  alignmentOptions: string[] = ['Lawful Good', 'Chaotic Good', 'Neutral', 'Lawful Evil', 'Chaotic Evil']; // Example alignment options

  constructor(private formBuilder: FormBuilder,private _formBuilder: FormBuilder) { }

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  
  calculateNumber(): number {
    return Math.floor((this.numberValue - 10) / 2);
  }

  ngOnInit(): void {
    this.characterForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      story: ['', Validators.required],
      characterClass: ['', Validators.required],
      race: ['', Validators.required],
      alignment: ['', Validators.required]
    });
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
}
