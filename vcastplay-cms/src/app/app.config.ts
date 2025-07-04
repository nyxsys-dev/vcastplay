import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import myPreset from '../../public/assets/myPreset';

// ECharts Configuration
import { provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { provideHttpClient } from '@angular/common/http';

// import * as L from 'leaflet';
import 'leaflet';
import 'leaflet.markercluster';

echarts.use([
  PieChart,
  LineChart,
  BarChart, 
  TitleComponent, 
  TooltipComponent,
  ToolboxComponent,
  GridComponent, 
  LegendComponent,
  CanvasRenderer
]);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' }) ),
    provideHttpClient(),
    providePrimeNG({
      theme: { 
        preset: myPreset,
        options: {
          darkModeSelector: '.my-app-dark',
        }
      }
    }),
    provideAnimationsAsync(),
    provideEchartsCore({ echarts })
  ]
};
