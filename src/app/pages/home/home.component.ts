import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DefaultHomeComponent } from "../../components/default-home/default-home.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

interface quizForm {
  area: FormControl<string>,
  conteudos: FormControl<string[]>
}

@Component({
  selector: 'app-home',
  imports: [
    DefaultHomeComponent,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    BrowserAnimationsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class HomeComponent {
  quizForm!: FormGroup<quizForm>;

  areaControl = new FormControl('');
  areaOptions: string[] = ['Matemática', 'Português', 'Química', 'Biologia', 'Física'].sort();
  conteudoControl = new FormControl('');
  conteudosSelecionados: string[] = [];
  
  filteredAreas: Observable<string[]>;
  filteredConteudos!: Observable<string[]>;

  conteudosPorArea: Record<string, string[]> = {
    Matemática: ['Álgebra', 'Geometria', 'Trigonometria'],
    Português: ['Gramática', 'Literatura', 'Interpretação'],
    Química: ['Orgânica', 'Inorgânica', 'Físico-Química'],
    Biologia: ['Citologia', 'Genética', 'Ecologia'],
    Física: ['Mecânica', 'Termologia', 'Óptica']
  };

  conteudosDisponiveis: string[] = [];

  constructor(
    private router: Router
  ){
    this.quizForm = new FormGroup({
      area: new FormControl('', { nonNullable: true }),
      conteudos: new FormControl<string[]>([], { nonNullable: true }),
    });    

    this.filteredAreas = this.areaControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterAreas(value || ''))
    )

    this.areaControl.valueChanges.subscribe(area => {
      this.conteudosSelecionados = [];
      this.quizForm.get('conteudos')?.setValue([]);
      
      if (area && this.conteudosPorArea.hasOwnProperty(area)) {
        this.conteudosDisponiveis = this.conteudosPorArea[area];
      } else {
        this.conteudosDisponiveis = [];
      }
    
      this._setupFilteredConteudos();
    })

    this._setupFilteredConteudos();
    
  }

  private _filterAreas(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.areaOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _setupFilteredConteudos(): void {
    this.filteredConteudos = this.conteudoControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = (value || '').toLowerCase();
        return this.conteudosDisponiveis.filter(option =>
          option.toLowerCase().includes(filterValue) &&
          !this.conteudosSelecionados.includes(option)
        );
      })
    );
  }

  selecionarConteudo(event: any): void {
    const value = event.option.value;
    if (value && !this.conteudosSelecionados.includes(value)) {
      this.conteudosSelecionados.push(value);
      this.quizForm.get('conteudos')?.setValue(this.conteudosSelecionados);
    }
    this.conteudoControl.setValue('');
  }

  removerConteudo(conteudo: string): void {
    const index = this.conteudosSelecionados.indexOf(conteudo);
    if (index >= 0) {
      this.conteudosSelecionados.splice(index, 1);
      this.quizForm.get('conteudos')?.setValue(this.conteudosSelecionados);
    }
  }

  adicionarConteudoManual(event: any): void {
    const inputValue = event.value?.trim();
    if (inputValue && !this.conteudosSelecionados.includes(inputValue)) {
      this.conteudosSelecionados.push(inputValue);
      this.quizForm.get('conteudos')?.setValue(this.conteudosSelecionados);
    }
    this.conteudoControl.setValue('');
  }
}
