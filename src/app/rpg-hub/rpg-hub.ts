import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faBook,
  faPeopleGroup,
  faArrowRightFromBracket,
  faPaperPlane,
  faCaretDown,
  faCaretUp,
  faEllipsis,
  faUserPlus,
  faPlus,
  faHeart,
  faBoltLightning,
  faSackXmark
} from '@fortawesome/free-solid-svg-icons';
import { MatExpansionModule } from '@angular/material/expansion';
import { CreationDialog } from './creation-dialog/creation-dialog';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rpg-hub',
  imports: [FontAwesomeModule, MatExpansionModule],
  templateUrl: './rpg-hub.html',
  styleUrl: './rpg-hub.scss',
})
export class RpgHub {
  constructor(
    private dialog: MatDialog,
    private auth: AuthService,
    private router: Router,
  ){}

  faBars = faBars;
  faBook = faBook;
  faPeopleGroup = faPeopleGroup;
  faArrowRightFromBracket = faArrowRightFromBracket;
  faPaperPlane = faPaperPlane;
  faCaretUp = faCaretUp;
  faCaretDown = faCaretDown;
  faEllipsis = faEllipsis;
  faUserPlus = faUserPlus;
  faPlus = faPlus;
  faHeart = faHeart;
  faBoltLightning = faBoltLightning;
  faSackXmark = faSackXmark

  showSidebar = true;
  toggleSidebar() {
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
  toggleCampaigns() {
    this.showSidebar = true
    this.showCampaigns = !this.showCampaigns;
  }

  characters = [
    { id: 1, nome: 'Gorr', classe: 'Guerreiro', raca: 'Orc' },
    { id: 2, nome: 'Athas', classe: 'Mago', raca: 'Elfo' },
    { id: 3, nome: 'Jack', classe: 'Ladino', raca: 'Humano' },
  ];

  showCharacters = false;
  toggleCharacters() {
    this.showSidebar = true
    this.showCharacters = !this.showCharacters;
  }

  createCharacter(){
    this.dialog.open(CreationDialog, {
      width: "800px",
      data: {
        title: 'Conta criada com sucesso',
        message:
          'Verifique a mensagem enviada para seu e-mail para terminar a criação de sua conta.',
      },
    });
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
