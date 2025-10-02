import { Component, inject, OnDestroy } from '@angular/core';
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
import { WebsocketService } from '../services/websocket';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, Validators, FormsModule, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { marked } from 'marked';

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
export class RpgHub implements OnDestroy {
  messages: { origin: string, text: string }[] = [];
  private sub!: Subscription;

  constructor(
    private dialog: MatDialog,
    private auth: AuthService,
    private character: CharacterService,
    private campaign: CampaignService,
    private ws: WebsocketService,
    private router: Router
  ) {
    this.listCharacters();
    this.listCampaigns();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.ws.disconnect();
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
    this.messages = [];
    for (let i = 1; i < this.selectedCampaign.events.length; i++){
      const event = this.selectedCampaign.events[i];
      if ("narracao" in event) {
        this.messages.push({ origin: 'ai', text: marked.parse(event.narracao) as string });
      } else if ("acao" in event) {
        this.messages.push({ origin: 'user', text: marked.parse(event.acao) as string });
      }
    }
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
  showSidebar = window.innerWidth > 768;
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

  isValidJson(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
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
  async listCampaigns(campanha_id: string = '') {
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
    let currentMessage = '';

    this.ws.createCampanha(this.personagem_id.value as string);

    this.sub = this.ws.messages$.subscribe(async char => {
      let resposta = char.replace(/```json/, '').replace(/```/, '').trim();
      if (!this.selectedCampaign.campanha_id) {
        this.listCampaigns(this.ws.campanha_id);
      }

      if (this.isValidJson(resposta)){
        const jsonResposta = JSON.parse(resposta);
        if ("titulo" in jsonResposta && !("narracao" in jsonResposta)) {
          let campanha = this.campaigns.find(
            (campaign: { campanha_id: string }) => campaign.campanha_id === this.selectedCampaign.campanha_id
          );
          if (campanha) {
            campanha.titulo = jsonResposta.titulo;
          }
        } else if ("narracao" in jsonResposta) {
          const parsed = marked.parse(jsonResposta.narracao);
          currentMessage = parsed instanceof Promise ? await parsed : parsed as string;
          const index = this.messages.length ? this.messages.length-1 : 0;
          this.messages[index] = { origin: 'ai', text: currentMessage };
        }
      }
    });
  }

  prompt = new FormControl('', Validators.required);
  editCampaign() {
    this.prompt.markAsDirty();

    if (!this.prompt.valid || !this.selectedCampaign.campanha_id) {
      console.log("Campos não preenchidos");
      return
    };

    this.messages.push({ origin: 'user', text: this.prompt.value as string });
    this.messages.push({ origin: '', text: '' });

    let currentMessage = '';

    this.ws.sendMessageCampanha(this.prompt.value as string, this.selectedCampaign.campanha_id);
    this.prompt.setValue('');
    this.prompt.markAsPristine();

    this.sub = this.ws.messages$.subscribe(async char => {
      let resposta = char.replace(/```json/, '').replace(/```/, '').trim();

      if (this.isValidJson(resposta)){
        const jsonResposta = JSON.parse(resposta)
        if ("narracao" in jsonResposta) {
          const parsed = marked.parse(jsonResposta.narracao);
          currentMessage = parsed instanceof Promise ? await parsed : parsed as string;
          this.messages[this.messages.length-1] = { origin: 'ai', text: currentMessage }
        }
      }
    });
  }

  deleteCampaign(campanha_id: string) {
    if (!confirm('Tem certeza que quer excluir essa campanha?')) return;

    this.campaign.delete(campanha_id).subscribe({
      next: (res: any) => {
        this.listCampaigns();
        if (this.selectedCampaign.campanha_id == campanha_id) {
          this.selectedCampaign = {};
          this.messages = [];
        } else {
          this.openSnackBar('Campanha excluida!', 'Fechar');
        }
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
