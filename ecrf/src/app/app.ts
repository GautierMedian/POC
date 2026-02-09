import { Component } from '@angular/core';
import { CsvMapperComponent } from './components/csv-mapper/csv-mapper.component';

@Component({
  selector: 'app-root',
  imports: [CsvMapperComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'CSV Mapper';
}
