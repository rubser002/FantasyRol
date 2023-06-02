export class SpellMiniDTO {
    id: string;
    name: string;
    description: string;
    schoolDesc: string | null;
    spellLevel: number;
    components: string | null;
    sComponents: string | null;
  
    constructor(
      id: string,
      name: string,
      description: string,
      schoolDesc: string | null,
      spellLevel: number,
      components: string | null,
      sComponents: string | null
    ) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.schoolDesc = schoolDesc;
      this.spellLevel = spellLevel;
      this.components = components;
      this.sComponents = sComponents;
    }
  }