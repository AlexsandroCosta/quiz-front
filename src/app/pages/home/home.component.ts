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
import { MatRadioModule } from '@angular/material/radio';
import { map, Observable, startWith, combineLatest } from 'rxjs';
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
import { AreaConteudoService } from '../../services/area-conteudo.service';
import { QuizService } from '../../services/quiz.service';

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
    MatRadioModule,
    FormsModule,
    ScrollingModule,
    NgApexchartsModule
  ],
  providers: [
    AreaConteudoService,
    QuizService
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit{
  quiz() {
    let { area, conteudos, nivel } = this.quizForm.value;

    let areaId: number | undefined;

    if (typeof area === 'object' && area !== null) {
      areaId = area.id;
    } else if (typeof area === 'string') {
      areaId = Number(area);
    }

    if (typeof areaId !== 'number' || isNaN(areaId)) {
      console.error('Área inválida');
      return;
    }

    const conteudosIds: number[] = Array.isArray(conteudos)
      ? conteudos.map((c: any) => (typeof c === 'object' && c !== null ? c.id : Number(c)))
      : [];

    if (typeof nivel !== 'string' || nivel.trim() === '') {
      console.error('Nível inválido');
      return;
    }

    const dados = {
      area: areaId,
      conteudos: conteudosIds,
      nivel: nivel.trim(),
    };

    this.quizService.gerarQuiz(dados).subscribe({
      next: (res) => {
        this.quizService.setQuiz(res);
        this.router.navigate(['/quiz'])
      },
      error: (err) => {
        console.error('Erro ao gerar quiz:', err);
      },
    });
  }


  quizForm = new FormGroup({
    area: new FormControl<{ id: number, nome: string } | string>('', { nonNullable: true }),
    conteudos: new FormControl<{ id: number; nome: string; area: number }[]>([], { nonNullable: true }),
    nivel: new FormControl('facil'),
  });

  separatorKeysCodes: number[] = [ENTER, COMMA];
  currentContentControl = new FormControl('');
  contents = signal<{ id: number; nome: string; area: number }[]>([]);
  filteredContentSignal = signal<string[]>([]);

  areaOptions = signal<{ id: number, nome: string }[]>([]);
  areaSearchText = signal<string>('');

  selectedContents = signal<{ id: number; nome: string; area: number }[]>([]);
  availableContents = signal<{ id: number; nome: string; area: number }[]>([]);
  
  ranking = signal<{ posicao: number; nome: string; pontos: number }[]>([]);

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

  contentsApi = signal<{ id: number; nome: string; area: number }[]>([]);
  
  // Define um Observable para áreas filtradas
  filteredAreas = computed(() => {
    const searchText = this.areaSearchText().toLowerCase();
    return this.areaOptions().filter(option =>
      option.nome.toLowerCase().includes(searchText)
    );
  });

  contentSearchText = signal<string>('');

  // Observable para conteúdos filtrados
  // Atualize o filteredContent$ para filtrar a partir de contentsFromApi
  filteredContent$: Observable<{ id: number; nome: string; area: number }[]> = 
    this.currentContentControl.valueChanges.pipe(
      startWith(''),
      map(input => {
        const filterValue = (typeof input === 'string' ? input.toLowerCase() : '');
        const selected = this.selectedContents();
        return this.availableContents()
          .filter(c => c.nome.toLowerCase().includes(filterValue))
          .filter(c => !selected.some(s => s.id === c.id)); // Remove os já selecionados
      })
    );

  announcer = inject(LiveAnnouncer);

  constructor(
    private router: Router,
    private areaConteudoService: AreaConteudoService,
    private quizService : QuizService
  ) {}

  historico: any;

  ngOnInit(): void {
    this.quizService.getHistorico().subscribe({
      next: (data) => {
        this.historico = data.map(item => ({
          ...item,
          criacao: new Date(item.criacao)
        }));
      },
      error: (err) => {
        console.error('Erro ao carregar histórico', err);
        this.historico = [];
      }
    });
    
    // Habilita/desabilita o FormControl e limpa chips ao trocar de área
    this.quizForm.controls.area.valueChanges.pipe(
      startWith('')
    ).subscribe(value => {
      const searchText = typeof value === 'string' ? value : '';
      this.areaSearchText.set(searchText);
    });

    // PRINCIPAL MUDANÇA: Reset completo quando área é alterada
    this.quizForm.get('area')!.valueChanges.subscribe(area => {
      if (typeof area === 'string' && area.trim() === '') {
        this.quizForm.controls.area.setValue('', { emitEvent: false });
      }
      // Reset dos conteúdos selecionados
      this.selectedContents.set([]);
      this.quizForm.controls.conteudos.setValue([]);
      
      // Limpa o input de conteúdo
      this.currentContentControl.setValue('');
      
      if (typeof area === 'object' && area !== null) {
        this.currentContentControl.enable({ emitEvent: false });

        // Carrega novos conteúdos da área selecionada
        this.areaConteudoService.getConteudos(area.id).subscribe({
          next: (conteudos) => {
            const objs = conteudos.map(c => ({
              id: c.id,
              nome: c.nome,
              area: area.id
            }));
            this.availableContents.set(objs);

            const current = this.currentContentControl.value;
            this.currentContentControl.setValue(current, { emitEvent: true });
          },
          error: () => {
            console.error('Erro ao carregar conteúdos da área selecionada');
            this.availableContents.set([]);
          }
        });
      } else {
        this.currentContentControl.disable({ emitEvent: false });
        this.availableContents.set([]);
      }
    });

    // Inicialmente, como área começa vazia, já desabilita
    this.currentContentControl.disable({ emitEvent: false });

    this.areaConteudoService.getAreas().subscribe({
      next: (areas) => {
        this.areaOptions.set(areas.sort((a, b) => a.nome.localeCompare(b.nome)));
      },
      error: () => {
        console.error('Erro ao carregar áreas da API');
      }
    });

    this.quizService.getRanking().subscribe({
      next: (data) => {
        const rankingOrdenado = data
          .sort((a, b) => b.pontuacao - a.pontuacao) // maior pontuação primeiro
          .map((item, index) => ({
            posicao: index + 1,
            nome: item.nome_usuario,
            pontos: item.pontuacao
          }));
        this.ranking.set(rankingOrdenado);
      },
      error: (err) => {
        console.error('Erro ao carregar ranking:', err);
        this.ranking.set([]);
      }
    });
  }

  // Filtro para as áreas
  private _filterAreas(value: string): { id: number, nome: string }[] {
    const filterValue = value.toLowerCase();
    return this.areaOptions().filter(option => option.nome.toLowerCase().includes(filterValue));
  }

  displayArea(area: { id: number, nome: string } | string | null | undefined): string {
    if (!area) return '';
    return typeof area === 'string' ? area : area.nome ?? '';
  }


  addContent(event: MatChipInputEvent): void {
    // Se você ainda quiser permitir texto livre, crie um objeto "fantasma"
    const value = (event.value || '').trim();
    if (value) {
      const newObj = { id: 0, nome: value, area: 0 };
      this._addContentToSelection(newObj);
    }
    event.chipInput!.clear();
    this.currentContentControl.setValue('');
  }

  remove(content: { id: number; nome: string; area: number }): void {
    const updatedContents = this.selectedContents().filter(c => c.id !== content.id || c.nome !== content.nome);
    this.selectedContents.set(updatedContents);
    this.quizForm.controls.conteudos.setValue(updatedContents);
    this.announcer.announce(`Removed ${content.nome}`);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const obj = event.option.value as { id: number; nome: string; area: number };
    this._addContentToSelection(obj);
    // limpa o input visual
    this.currentContentControl.setValue('');
  }

  private _addContentToSelection(obj: { id: number; nome: string; area: number }) {
    const currentSelected = this.selectedContents();
    
    // Verifica se já não está selecionado
    if (!currentSelected.some(c => c.id === obj.id && c.nome === obj.nome)) {
      const updatedContents = [...currentSelected, obj];
      this.selectedContents.set(updatedContents);
      this.quizForm.controls.conteudos.setValue(updatedContents);
    }
  }
}