import { Component, ChangeDetectionStrategy, computed, inject, signal, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, startWith } from 'rxjs';
import { DefaultHomeComponent } from "../../components/default-home/default-home.component";
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexChart,
  ApexAxisChartSeries,
  ApexStroke,
  ApexFill,
  ApexMarkers,
  ApexXAxis,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  fill: ApexFill;
  markers: ApexMarkers;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    DefaultHomeComponent,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    FormsModule,
    ScrollingModule,
    NgApexchartsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  quizForm = new FormGroup({
    area: new FormControl('', { nonNullable: true }),
    conteudos: new FormControl<string[]>([], { nonNullable: true }),
  });

  separatorKeysCodes: number[] = [ENTER, COMMA];
  currentContentControl = new FormControl('');
  contents = signal<string[]>([]);
  filteredContentSignal = signal<string[]>([]);

  areaOptions: string[] = ['Matemática', 'Português', 'Química', 'Biologia', 'Física'].sort();

  historico = [
    { data: '2025-05-01', hora: '14:00', area: 'Matemática', pontos: 8 },
    { data: '2025-05-02', hora: '10:30', area: 'Português', pontos: 6 },
    { data: '2025-05-02', hora: '13:45', area: 'Química', pontos: 9 },
    { data: '2025-05-03', hora: '09:15', area: 'Biologia', pontos: 7 },
    { data: '2025-05-03', hora: '16:20', area: 'Física', pontos: 10 }
  ].sort((a, b) => {
    const dataA = new Date(`${a.data}T${a.hora}`);
    const dataB = new Date(`${b.data}T${b.hora}`);
    return dataB.getTime() - dataA.getTime(); // mais recentes primeiro
  });

  ranking = [
    { posicao: 1, nome: 'Time Alpha', pontos: 45 },
    { posicao: 2, nome: 'Time Bravo', pontos: 42 },
    { posicao: 3, nome: 'Time Charlie', pontos: 40 },
    { posicao: 4, nome: 'Time Delta', pontos: 38 },
    { posicao: 5, nome: 'Time Echo', pontos: 36 },
    { posicao: 6, nome: 'Time Foxtrot', pontos: 34 },
    { posicao: 7, nome: 'Time Golf', pontos: 32 },
    { posicao: 8, nome: 'Time Hotel', pontos: 30 },
    { posicao: 9, nome: 'Time India', pontos: 28 },
    { posicao: 10, nome: 'Time Juliett', pontos: 26 }
  ];

  public chartOptions: ChartOptions = {
    series: [
      {
        name: "Total de pontos",
        data: [80, 50, 30, 40, 100, 20]
      }
    ],
    chart: {
      type: "radar",
      height: 285,
      toolbar: {
        show: false // aqui desativa o botão de download
      },
    },
    xaxis: {
      categories: ["Matemática", "Português", "Química", "Biologia", "Física", "Artes"],
      labels: {
        style: {
          colors: ['#555555', '#555555','#555555','#555555','#555555','#555555'], 
          fontSize: '14px'
        }
      },
    },
    stroke: {
      width: 2,
      colors: ['#fea3b2'] 
    },
    fill: {
      opacity: 0.1,
      colors: ['#fea3b2']
    },
    markers: {
      size: 4,
      colors: ['#fea3b2']
    },
  };
  

  // Define um Observable para áreas filtradas
  filteredAreas: Observable<string[]> = this.quizForm.controls.area.valueChanges.pipe(
    startWith(''),
    map(value => value ? this._filterAreas(value) : this.areaOptions)
  );
  
  // Define os conteúdos disponíveis para cada área
  allContents: Record<string, string[]> = {
    Matemática: ['Álgebra', 'Geometria', 'Trigonometria'],
    Português: ['Gramática', 'Literatura', 'Interpretação'],
    Química: ['Orgânica', 'Inorgânica', 'Físico-Química'],
    Biologia: ['Citologia', 'Genética', 'Ecologia'],
    Física: ['Mecânica', 'Termologia', 'Óptica']
  };

  // Observable para conteúdos filtrados
  filteredContent$: Observable<string[]> = this.quizForm.valueChanges.pipe(
    startWith(this.quizForm.value), // Inicia com os valores atuais do formulário
    map(() => {
      const area = this.quizForm.get('area')?.value;
      const currentInput = this.currentContentControl.value?.toLowerCase() ?? '';

      if (!area || !this.allContents[area]) return [];
      const areaContents = this.allContents[area];
      
      return currentInput
        ? areaContents.filter(c => c.toLowerCase().includes(currentInput))
        : areaContents;
    })
  );
  
  announcer = inject(LiveAnnouncer);

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Habilita/desabilita o FormControl e limpa chips ao trocar de área
    this.quizForm.get('area')!.valueChanges.subscribe(area => {
      // limpa os conteúdos selecionados
      this.contents.set([]); // Limpa a lista de conteúdos selecionados

      if (area) {
        this.currentContentControl.enable({ emitEvent: false });
      } else {
        this.currentContentControl.disable({ emitEvent: false });
      }
    });

    // Inicialmente, como área começa vazia, já desabilita
    this.currentContentControl.disable({ emitEvent: false });
  }

  // Filtro para as áreas
  private _filterAreas(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.areaOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  addContent(event: MatChipInputEvent): void {
    const area = this.quizForm.get('area')?.value;
    if (!area) return;
    const value = (event.value || '').trim();
  
    if (value && !this.contents().includes(value)) {
      this.contents.update(contents => [...contents, value]);
    }
  }

  remove(content: string): void {
    this.contents.update(contents => {
      const index = contents.indexOf(content);
      if (index < 0) return contents;
      contents.splice(index, 1);
      this.announcer.announce(`Removed ${content}`);
      return [...contents];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
  const area = this.quizForm.get('area')?.value;
  if (!area) return;
  const selectedValue = event.option.viewValue;

  if (!this.contents().includes(selectedValue)) {
    this.contents.update(contents => [...contents, selectedValue]);
  }

  event.option.deselect(); // opcional, dependendo do comportamento desejado
}

}