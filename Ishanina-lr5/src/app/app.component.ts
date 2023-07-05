import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: `
    <div class="navbar bg-info text-light col-12">
      <h5> Биржа акций </h5>
      <a class="btn btn-light" href="/brokers">Брокеры</a>
      <a class="btn btn-light" href="/stoks">Акции</a>
      <a class="btn btn-light" href="/setting">Настройка биржи</a>
    </div>
    <router-outlet></router-outlet>`,
  styleUrls: ['./css/app.component.css', './css/bootstrap.min.css']
})
export class AppComponent {
}
