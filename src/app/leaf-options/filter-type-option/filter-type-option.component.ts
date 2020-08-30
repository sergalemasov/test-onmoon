import { Component, ChangeDetectionStrategy, Input, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { FilterModel } from 'app/interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'filter-type-option',
    templateUrl: './filter-type-option.component.html',
    styleUrls: ['./filter-type-option.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FilterTypeOptionComponent),
            multi: true,
        }
    ]
})
export class FilterTypeOptionComponent implements OnInit, OnDestroy, ControlValueAccessor {
    @Input() parentFormGroup: FormGroup;
    @Input() filters: FilterModel[];

    formControl = new FormControl();

    private destroy$ = new Subject<void>();

    ngOnInit() {
        this.subscribeToControlChanges();
    }

    ngOnDestroy() {
        this.destroy$.next();
    }

    writeValue(value: FilterModel) {
        this.formControl.setValue(value, {emitEvent: false});
    }

    registerOnTouched() {}

    registerOnChange(fn: (value: FilterModel) => void) {
        this.onChange = fn;
    }

    private onChange(_value: FilterModel) {}

    private subscribeToControlChanges() {
        this.formControl.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(value => this.onChange(value));
    }
}
