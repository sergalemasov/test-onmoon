import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FilterModel } from 'app/interfaces';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { filterValueControlNames } from '../consts/filter-value-control-names.const';
import { FilterRepresentation } from 'app/enums/filter-representation.enum';
import { FilterValueFormValue } from '../interfaces/filter-value-form-value.interface';

@Component({
    selector: 'filter-value-option',
    templateUrl: './filter-value-option.component.html',
    styleUrls: ['./filter-value-option.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FilterValueOptionComponent),
            multi: true,
        }
    ]
})
export class FilterValueOptionComponent implements OnInit, OnDestroy, ControlValueAccessor {
    @Input() filters: FilterModel[];

    @Input('selectedFilter')
    set selectedFilterSetter(selectedFilter: FilterModel) {
        this.formGroup.reset();

        this.selectedFilter = selectedFilter;
    }

    filterValueControlNames = filterValueControlNames;
    FilterRepresentation = FilterRepresentation;
    formGroup = this.formBuilder.group({
        [filterValueControlNames.input]: [],
        [filterValueControlNames.not]: [],
        [filterValueControlNames.operator]: []
    });
    selectedFilter: FilterModel;

    private destroy$ = new Subject<void>();

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.subscribeToFormChanges();
    }

    ngOnDestroy() {
        this.destroy$.next();
    }

    writeValue(value: FilterValueFormValue) {
        if (value) {
            this.formGroup.patchValue(value, { emitEvent: false });
        } else {
            this.formGroup.reset({ emitEvent: false });
        }
    }

    registerOnChange(fn: (value: FilterValueFormValue) => void) {
        this.onChange = fn;
    }

    registerOnTouched() {}

    private subscribeToFormChanges() {
        this.formGroup.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(value => {
                const valueToEmit: FilterValueFormValue = {
                    not: value.not,
                    input: value.input,
                    operator: value.operator
                }

                if (this.selectedFilter.filterRepresentation === FilterRepresentation.CHECKBOX) {
                    valueToEmit.operator = value.input
                        ? '+'
                        : '-';
                } else if (this.selectedFilter.filterRepresentation === FilterRepresentation.RADIO_GROUP) {
                    valueToEmit.operator = '=';
                }

                this.onChange(valueToEmit);
            });
    }

    private onChange(_value: FilterValueFormValue) {}
}
