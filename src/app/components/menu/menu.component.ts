import { Component, OnInit } from '@angular/core';
import { AngularFireService } from '../../services/angular-fire.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  implements OnInit {

  constructor(public angularFireService: AngularFireService) { }

  ngOnInit() {}

  async SignOut() {
    alert("entro aca")
    await this.angularFireService.SignOut();
  }
}
