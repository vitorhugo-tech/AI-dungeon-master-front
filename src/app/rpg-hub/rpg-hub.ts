import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faBook, faPeopleGroup, faGear, faPaperPlane, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { MatExpansionModule } from '@angular/material/expansion';


@Component({
  selector: 'app-rpg-hub',
  imports: [FontAwesomeModule, MatExpansionModule],
  templateUrl: './rpg-hub.html',
  styleUrl: './rpg-hub.scss'
})
export class RpgHub {
  faBars = faBars
  faBook = faBook
  faPeopleGroup = faPeopleGroup
  faGear = faGear
  faPaperPlane = faPaperPlane
  faCaretUp = faCaretUp
  faCaretDown = faCaretDown

  items = [
    { id: 1, title: 'Section 1' },
    { id: 2, title: 'Section 2' },
    { id: 3, title: 'Section 3' }
  ];

  showCampaigns = false;
  toggleCampaigns(event: Event) {
    event.preventDefault();
    this.showCampaigns = !this.showCampaigns;
  }

  showCharacters = false;
  toggleCharacters(event: Event) {
    event.preventDefault();
    this.showCharacters = !this.showCharacters;
  }

  showSidebar = false;
  toggleSidebar(event: Event) {
    event.preventDefault();
    this.showSidebar = !this.showSidebar;
  }
}
