import { Component } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { EChartsOption } from 'echarts/types/dist/shared';



@Component({
  selector: 'app-sample-chart',
  imports: [ PrimengUiModule ],
  templateUrl: './sample-chart.component.html',
  styleUrl: './sample-chart.component.scss',
  providers: [ ]
})
export class SampleChartComponent {

  options!: EChartsOption;

  ngOnInit() {
    this.options = {
      // title: {text: 'Sample Chart Title' },
      tooltip: { trigger: 'axis' },
      legend: { 
        data: ['Sales', 'Visitors'],
        // bottom: 0
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [ 
        {
          name: 'Sales',
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          itemStyle: { borderRadius: [ 15, 15, 0, 0 ] }
        },
        {
          name: 'Visitors',
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
          smooth: true, // ✅ Makes line smooth
          lineStyle: {
            color: '#FF5733', // Line color
            width: 3
          },
          itemStyle: {
            color: '#FF5733' // Marker color
          },
          symbol: 'circle', // ✅ Small circle markers
          symbolSize: 8
        }
      ]
    };
  }
}
