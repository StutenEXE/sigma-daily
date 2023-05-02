import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaChartComponent } from './sigma-chart.component';

describe('SigmaChartComponent', () => {
  let component: SigmaChartComponent;
  let fixture: ComponentFixture<SigmaChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SigmaChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigmaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
