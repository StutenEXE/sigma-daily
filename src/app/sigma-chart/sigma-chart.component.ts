import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { user } from '@angular/fire/auth';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-sigma-chart',
  templateUrl: './sigma-chart.component.html',
  styleUrls: ['./sigma-chart.component.scss']
})
export class SigmaChartComponent implements OnInit {

  readonly NUMBER_OF_SIGMAS = 130;

  readonly X_STEP = (490 * 100) / 4960;
  readonly Y_STEP = (490 * 100) / 7016;

  readonly X_MARGIN = (35 * 100) / 4960;
  readonly Y_MARGIN = (573 * 100) / 7016;

  numbers!: number[];
  user!: User;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUser().then(
      data => {
        this.user = data.val();
      }
    );
    this.numbers = Array(this.NUMBER_OF_SIGMAS).fill(null).map((x, i) => i);
    console.log(this.numbers)
  }

  calculateCoordsArea(i: number) {
    let x = i % 10;
    let y = Math.floor(i / 10);
    // console.log(i + " = (" + x + ", " + y + ")")
    // let x1 = 35 + 490 * x;
    // let y1 = 573 + 490 * y;
    let x1 = this.X_MARGIN + x * this.X_STEP;
    let y1 = 8.17 + y * this.Y_STEP;
    return {
      x: x1,
      y: y1
    };
  }

  setSelected(event: MouseEvent, sigmaIndex: number) {
    if (user != undefined) {
      this.user.sigma = sigmaIndex;
      this.userService.updateSigma(sigmaIndex);
    }
  }
}
