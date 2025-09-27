import { Component, inject } from '@angular/core';
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
  faSackXmark,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Dialog } from '../dialog/dialog';
import { CreationDialog } from './creation-dialog/creation-dialog';
import { AuthService } from '../services/auth';
import { CharacterService } from '../services/character';

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
    private character: CharacterService,
    private router: Router
  ) {
    this.listCharacters();
  }

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
  faSackXmark = faSackXmark;
  faXmark = faXmark;

  showSidebar = true;
  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
    if (!this.showSidebar) {
      this.showCharacters = false;
      this.showCampaigns = false;
    }
  }

  characters: any = [];
  listCharacters() {
    this.character.list().subscribe({
      next: (res: any) => {
        this.characters = res;
      },
      error: (err: any) => {
        alert('Erro ao listar personagens');
        console.error('Erro ao listar personagens:', err);
      },
    });
  }

  showCharacters = false;
  toggleCharacters() {
    this.showSidebar = true;
    this.showCharacters = !this.showCharacters;
  }

  items = [
    { id: 1, titulo: 'As minas perdidas de Phandelver', personagem: 1 },
    { id: 2, titulo: 'A Maldição de Strahd', personagem: 3 },
    { id: 3, titulo: 'O Templo do Mal Elemental', personagem: 2 },
  ];

  showCampaigns = false;
  toggleCampaigns() {
    this.showSidebar = true;
    this.showCampaigns = !this.showCampaigns;
  }

  snackBar = inject(MatSnackBar);
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
  }

  createCharacter() {
    const dialogRef = this.dialog.open(CreationDialog, { width: '800px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        delete result.personagem_id;

        this.character.create(result).subscribe({
          next: (res: any) => {
            this.listCharacters();
            this.openSnackBar('Personagem criado!', 'Fechar');
          },
          error: (err: any) => {
            this.dialog.open(Dialog, {
              width: '800px',
              data: {
                title: 'Erro ao criar personagem!',
                message: 'Tente novamente, caso o erro persista contacte o desenvolvedor.',
              },
            });
            console.error('Erro ao criar personagem:', err);
          },
        });
      }
    });
  }

  editCharacter(personagem_id: string) {
    const data = Object.assign({}, this.characters.find(
      (char: { personagem_id: string }) => char.personagem_id === personagem_id
    ));
    data.origens = data.origens.split(" e ")

    const dialogRef = this.dialog.open(CreationDialog, {
      width: '800px',
      data: {
        personagem_id: data.personagem_id,
        nome: data.nome,
        classe: data.classe,
        raca: data.raca,
        origens: data.origens,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.character.update(result).subscribe({
          next: (res: any) => {
            this.listCharacters();
            this.openSnackBar('Personagem alterado!', 'Fechar');
          },
          error: (err: any) => {
            this.dialog.open(Dialog, {
              width: '800px',
              data: {
                title: 'Erro ao alterar personagem!',
                message: 'Tente novamente, caso o erro persista contacte o desenvolvedor.',
              },
            });
            console.error('Erro ao alterar personagem:', err);
          },
        });
      }
    });
  }

  deleteCharacter(personagem_id: string) {
    if (!confirm('Tem certeza que quer apagar esse personagem?')) return;

    this.character.delete(personagem_id).subscribe({
      next: (res: any) => {
        this.listCharacters();
        this.openSnackBar('Personagem apagado!', 'Fechar');
      },
      error: (err: any) => {
        this.dialog.open(Dialog, {
          width: '800px',
          data: {
            title: 'Erro ao apagar personagem!',
            message: 'Tente novamente, caso o erro persista contacte o desenvolvedor.',
          },
        });
        console.error('Erro ao apagar personagem:', err);
      },
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
