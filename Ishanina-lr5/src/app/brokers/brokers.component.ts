import {Component, OnInit} from '@angular/core';
import {HttpService} from '../http.service';

class Broker {
  name: string;
  money: number;
  ID: number;
  constructor(name: string, money: number, ID: number) {
    this.name = name;
    this.money = money;
    this.ID = ID;
  }
}

@Component({
  selector: 'app-brokers',
  templateUrl: './brokers.component.html',
  providers: [HttpService],
  styleUrls: ['../css/app.component.css', '../css/bootstrap.min.css']
})

export class BrokersComponent implements OnInit {
  brokers: Broker[] = [];
  name: string;
  money: number;
  ID: number;


  constructor(private httpSer: HttpService) {}
  ngOnInit() {
    this.Init();
  }

  private Init() {
    this.httpSer.get_brokers().subscribe( (date: any) => {
      this.brokers = date;
      console.log(this.brokers);
    });
  }

  delete(ID: number) {
    const index = this.brokers.findIndex(function (broker: Broker ) {
      return broker.ID === ID;
    });
    this.brokers.splice(index, 1);
    this.httpSer.set_brokers(this.brokers).subscribe();
  }

  edit() {
    for (let b of this.brokers){
      if (b.money < 0) {
        alert("Запас не может быть отрицательным");
        return;
      }
    }

    this.httpSer.set_brokers(this.brokers).subscribe();
  }

  add() {
    if (this.money < 0) {
      alert("Запас не может быть отрицательным");
      return;
    }
    this.ID = this.brokers[this.brokers.length - 1].ID + 1;
    this.brokers.push(new Broker(this.name, this.money, this.ID));
    this.httpSer.set_brokers(this.brokers).subscribe();
  }

}

