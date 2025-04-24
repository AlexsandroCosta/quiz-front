import { Component, ChangeDetectionStrategy, computed, inject, model, signal } from '@angular/core';
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
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormsModule} from '@angular/forms';

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
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HomeComponent {
  quizForm!: FormGroup<quizForm>;

  areaControl = new FormControl('');
  areaOptions: string[] = ['Matemática', 'Português', 'Química', 'Biologia', 'Física'].sort();
  filteredAreas: Observable<string[]>;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  currentContent = model('');
  contents = signal(['Lemon']);
  allContents: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  filteredContent = computed(() => {
    const currentContent = this.currentContent().toLowerCase();
    return currentContent
      ? this.allContents.filter(content => content.toLowerCase().includes(currentContent))
      : this.allContents.slice();
  });
  
  announcer = inject(LiveAnnouncer);

  conteudosPorArea: Record<string, string[]> = {
    Matemática: ['Álgebra', 'Geometria', 'Trigonometria'],
    Português: ['Gramática', 'Literatura', 'Interpretação'],
    Química: ['Orgânica', 'Inorgânica', 'Físico-Química'],
    Biologia: ['Citologia', 'Genética', 'Ecologia'],
    Física: ['Mecânica', 'Termologia', 'Óptica']
  };

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
  }

  private _filterAreas(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.areaOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  addContent(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our content
    if (value) {
      this.contents.update(contents => [...contents, value]);
    }

    // Clear the input value
    this.currentContent.set('');
  }

  remove(content: string): void {
    this.contents.update(contents => {
      const index = contents.indexOf(content);
      if (index < 0) {
        return contents;
      }

      contents.splice(index, 1);
      this.announcer.announce(`Removed ${content}`);
      return [...contents];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.contents.update(contents => [...contents, event.option.viewValue]);
    this.currentContent.set('');
    event.option.deselect();
  }

}
