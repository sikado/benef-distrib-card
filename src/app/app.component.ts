import { Component, OnInit } from '@angular/core';

type navComp = 'import' | 'design' | 'export';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayedComp: navComp = 'import';

  constructor() {}
  ngOnInit(): void {}

  navigateTo(dest: navComp): void {
    this.displayedComp = dest;
  }
}
