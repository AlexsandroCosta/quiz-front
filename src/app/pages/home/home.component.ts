import { Component } from '@angular/core';
import { DefaultHomeComponent } from "../../components/default-home/default-home.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';

interface quizForm {
  area: FormControl,
  conteudos: FormControl
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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})

export class HomeComponent {
  quizForm!: FormGroup<quizForm>;
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  
  constructor(
    private router: Router
  ){
    this.quizForm = new FormGroup({
      area: new FormControl('', [Validators.required, Validators.maxLength(3)]),
      conteudos: new FormControl('', [Validators.required, Validators.minLength(3)])
    })

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

}
