import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { TipoDto } from '../../models/tipo.model';
import { TiposCacheService } from '../../services/tipos-cache.service';

export interface EventFilters {
  tipoId: number | null;
  nombre: string;
  direccion: string;
  precioMaximo: number | null;
}

@Component({
  selector: 'app-event-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './event-filters.component.html',
  styleUrl: './event-filters.component.css',
})
export class EventFiltersComponent implements OnInit, OnDestroy {
  @Output() filtersChanged = new EventEmitter<EventFilters>();

  form!: FormGroup;
  tipos: TipoDto[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private tiposCache: TiposCacheService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tipoId: [null],
      nombre: [''],
      direccion: [''],
      precioMaximo: [null],
    });

    this.tiposCache.getAll().pipe(takeUntil(this.destroy$)).subscribe(t => this.tipos = t);

    this.form.valueChanges
      .pipe(debounceTime(400), takeUntil(this.destroy$))
      .subscribe(val => this.filtersChanged.emit(val));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  reset(): void {
    this.form.reset();
  }
}
