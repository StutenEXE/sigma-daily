import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sigma-chart',
  templateUrl: './sigma-chart.component.html',
  styleUrls: ['./sigma-chart.component.scss']
})
export class SigmaChartComponent implements OnInit {

  readonly NUMBER_OF_SIGMAS = 130;

  numbers!: number[];

  constructor() { }

  ngOnInit(): void {
    this.numbers = Array(this.NUMBER_OF_SIGMAS).fill(0).map((x,i)=>i);
    console.log(this.numbers)
  }

  calculateCoordsArea(i: number) {
    let x = i % 10;
    let y = Math.floor(i / 10);
    console.log(i + " = (" + x + ", " + y + ")")
    // let x1 = 35 + 490 * x;
    // let y1 = 573 + 490 * y;
    let x1 = 0.7 + x * 9.88;
    let y1 = 8.17 + y * 6.98;
    return {
      x: x1,
      y: y1
    };
  }

}
