import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faBook,
  faPeopleGroup,
  faGear,
  faPaperPlane,
  faCaretDown,
  faCaretUp,
  faEllipsis,
  faUserPlus,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-rpg-hub',
  imports: [FontAwesomeModule, MatExpansionModule],
  templateUrl: './rpg-hub.html',
  styleUrl: './rpg-hub.scss',
})
export class RpgHub {
  faBars = faBars;
  faBook = faBook;
  faPeopleGroup = faPeopleGroup;
  faGear = faGear;
  faPaperPlane = faPaperPlane;
  faCaretUp = faCaretUp;
  faCaretDown = faCaretDown;
  faEllipsis = faEllipsis;
  faUserPlus = faUserPlus;
  faPlus = faPlus;

  showSidebar = true;
  toggleSidebar(event: Event) {
    event.preventDefault();
    this.showSidebar = !this.showSidebar;
    if (!this.showSidebar){
      this.showCharacters = false
      this.showCampaigns = false
    }
  }

  items = [
    { id: 1, titulo: 'As minas perdidas de Phandelver', personagem: 1 },
    { id: 2, titulo: 'A Maldição de Strahd', personagem: 3 },
    { id: 3, titulo: 'O Templo do Mal Elemental', personagem: 2 },
  ];

  showCampaigns = false;
  toggleCampaigns(event: Event) {
    event.preventDefault();
    this.showSidebar = true
    this.showCampaigns = !this.showCampaigns;
  }

  characters = [
    { id: 1, nome: 'Gorr', classe: 'Guerreiro', raca: 'Orc' },
    { id: 2, nome: 'Athas', classe: 'Mago', raca: 'Elfo' },
    { id: 3, nome: 'Jack', classe: 'Ladino', raca: 'Humano' },
  ];

  showCharacters = false;
  toggleCharacters(event: Event) {
    event.preventDefault();
    this.showSidebar = true
    this.showCharacters = !this.showCharacters;
  }
}
