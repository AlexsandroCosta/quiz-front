import { Component, ChangeDetectionStrategy, computed, inject, signal, effect } from '@angular/core';
import { DefaultHomeComponent } from "../../components/default-home/default-home.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormsModule } from '@angular/forms';
import {ScrollingModule} from '@angular/cdk/scrolling';

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
    ScrollingModule
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

  areaOptions: string[] = ['Matemática', 'Português', 'Química', 'Biologia', 'Física'].sort();

  historico = [
    {data: '2025-05-01', hora: '14:00', area: 'Matemática', pontos: 8},
    {data: '2025-05-02', hora: '10:30', area: 'Português', pontos: 6},
    {data: '2025-05-02', hora: '13:45', area: 'Química', pontos: 9},
    {data: '2025-05-03', hora: '09:15', area: 'Biologia', pontos: 7},
    {data: '2025-05-03', hora: '16:20', area: 'Física', pontos: 10}
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

  filteredAreas: Observable<string[]> = this.quizForm.controls.area.valueChanges.pipe(
    startWith(''),
    map(value => this._filterAreas(value || ''))
  );

  allContents: Record<string, string[]> = {
    Matemática: ['Álgebra', 'Geometria', 'Trigonometria'],
    Português: ['Gramática', 'Literatura', 'Interpretação'],
    Química: ['Orgânica', 'Inorgânica', 'Físico-Química'],
    Biologia: ['Citologia', 'Genética', 'Ecologia'],
    Física: ['Mecânica', 'Termologia', 'Óptica']
  };

  filteredContent = computed(() => {
    const area = this.quizForm.get('area')?.value;
    const currentInput = this.currentContentControl.value?.toLowerCase() ?? '';
    if (!area || !this.allContents[area]) return [];
    const areaContents = this.allContents[area];
    return currentInput
      ? areaContents.filter(c => c.toLowerCase().includes(currentInput))
      : areaContents;
  });

  announcer = inject(LiveAnnouncer);

  filteredContentSignal = signal<string[]>([]);

  constructor(private router: Router) {
    // sempre que área ou input mudarem, atualiza o sinal
    effect(() => {
      const area = this.quizForm.get('area')?.value;
      const currentInput = this.currentContentControl.value?.toLowerCase() ?? '';
      if (!area || !this.allContents[area]) {
        this.filteredContentSignal.set([]);
      } else {
        const areaContents = this.allContents[area];
        const filtered = currentInput
          ? areaContents.filter(c => c.toLowerCase().includes(currentInput))
          : areaContents;
        this.filteredContentSignal.set(filtered);
      }
    });
  }

  private _filterAreas(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.areaOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  addContent(event: MatChipInputEvent): void {
    const area = this.quizForm.get('area')?.value;
    if (!area) return;


    const value = (event.value || '').trim();
    if (value) {
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
    this.contents.update(contents => [...contents, event.option.viewValue]);
    event.option.deselect();
  }
}

