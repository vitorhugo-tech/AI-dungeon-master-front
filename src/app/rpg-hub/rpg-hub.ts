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
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { Dialog } from '../dialog/dialog';
import { CreationDialog } from './creation-dialog/creation-dialog';
import { AuthService } from '../services/auth';
import { CharacterService } from '../services/character';
import { CampaignService } from '../services/campaign';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, Validators, FormsModule, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class FieldErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-rpg-hub',
  imports: [
    FontAwesomeModule,
    MatExpansionModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './rpg-hub.html',
  styleUrl: './rpg-hub.scss',
})
export class RpgHub {
  constructor(
    private dialog: MatDialog,
    private auth: AuthService,
    private character: CharacterService,
    private campaign: CampaignService,
    private router: Router
  ) {
    this.listCharacters();
    this.listCampaigns();
  }

  /* Seleção de campanha e personagem ativos */
  matcher = new FieldErrorStateMatcher();

  personagem_id = new FormControl('', Validators.required);
  selectedCharacter: any = {};

  selectCharacter(){
    this.selectedCharacter = Object.assign({}, this.characters.find(
      (char: { personagem_id: string }) => char.personagem_id === this.personagem_id.value
    ));
  }

  selectedCampaign: any = {};

  selectCampaign(campanha_id: string){
    this.selectedCampaign = Object.assign({}, this.campaigns.find(
      (campaign: { campanha_id: string }) => campaign.campanha_id === campanha_id
    ));
    this.personagem_id.setValue(this.selectedCampaign.personagem);
    this.selectCharacter();
  }

  /* Ícones */
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

  /* Funções de exibição da sidebar */
  showSidebar = true;
  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
    if (!this.showSidebar) {
      this.showCharacters = false;
      this.showCampaigns = false;
    }
  }

  showCharacters = false;
  toggleCharacters() {
    this.showSidebar = true;
    this.showCharacters = !this.showCharacters;
  }

  showCampaigns = false;
  toggleCampaigns() {
    this.showSidebar = true;
    this.showCampaigns = !this.showCampaigns;
  }

  /* Utilidades */
  defaultErrorMsg = 'Tente novamente, caso o erro persista contacte o desenvolvedor.';

  snackBar = inject(MatSnackBar);
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000
    });
  }

  openAlert(errorTitle: string, err: any, errorMsg: string = this.defaultErrorMsg) {
    this.dialog.open(Dialog, {
      width: '800px',
      data: { title: errorTitle, message: errorMsg },
    });
    console.error(errorTitle, err);
  }

  /* Funções CRUD personagens */
  characters: any = [];
  listCharacters() {
    this.character.list().subscribe({
      next: (res: any) => this.characters = res,
      error: (err: any) => this.openAlert('Erro ao listar personagens!', err),
    });
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
          error: (err: any) => this.openAlert('Erro ao criar personagem!', err),
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
          error: (err: any) => this.openAlert('Erro ao alterar personagem!', err),
        });
      }
    });
  }

  deleteCharacter(personagem_id: string) {
    if (
      !confirm(
        'Tem certeza que quer excluir esse personagem?\n\n' +
        'NOTA: Campanhas associadas a ele também serão excluídas'
      )
    ) return;

    this.character.delete(personagem_id).subscribe({
      next: (res: any) => {
        this.listCharacters();
        this.listCampaigns();
        if (this.selectedCharacter.personagem_id == personagem_id) {
          this.personagem_id.setValue('');
          this.selectedCharacter = {};
        }
        this.openSnackBar('Personagem excluido!', 'Fechar');
      },
      error: (err: any) => this.openAlert('Erro ao excluir personagem!', err),
    });
  }

  /* Funções CRUD campanhas */
  campaigns: any = [];
  listCampaigns(campanha_id: string = '') {
    this.campaign.list().subscribe({
      next: (res: any) => {
        this.campaigns = res;
        if (campanha_id){
          this.selectCampaign(campanha_id);
        }
      },
      error: (err: any) => this.openAlert('Erro ao listar campanhas!', err),
    });
  }

  createCampaign() {
    const data = {
      titulo: "A Maldição de Strahd",
      descricao: "Aventura com elementos de terror",
      personagem_id: this.personagem_id.value,
    }

    this.campaign.create(data).subscribe({
      next: (res: any) => {
        this.listCampaigns(res.campanha_id);
        this.openSnackBar('Campanha criada!', 'Fechar');
      },
      error: (err: any) => this.openAlert('Erro ao criar campanha!', err),
    });
  }

  editCampaign(campanha_id: string) {
    const data = Object.assign({}, this.campaigns.find(
      (campaign: { campanha_id: string }) => campaign.campanha_id === campanha_id
    ));

    const result = {
      campanha_id: data.campanha_id,
      titulo: 'As Minas Perdidas de Phandelver'
    };

    this.campaign.update(result).subscribe({
      next: (res: any) => {
        this.listCampaigns();
        this.openSnackBar('Campanha alterada!', 'Fechar');
      },
      error: (err: any) => this.openAlert('Erro ao alterar campanha!', err),
    });
  }

  deleteCampaign(campanha_id: string) {
    if (!confirm('Tem certeza que quer excluir essa campanha?')) return;

    this.campaign.delete(campanha_id).subscribe({
      next: (res: any) => {
        this.listCampaigns();
        if (this.selectedCampaign.campanha_id == campanha_id) {
          this.selectedCampaign = {};
        }
        this.openSnackBar('Campanha excluida!', 'Fechar');
      },
      error: (err: any) => this.openAlert('Erro ao excluir campanha!', err),
    });
  }

  /* Auth */
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
