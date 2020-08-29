import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FilterModel } from 'app/interfaces';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { controlNames } from './consts/control-names.const';
import { FilterRepresentation } from 'app/enums/filter-representation.enum';

@Component({
    selector: 'filter-value-option',
    templateUrl: './filter-value-option.component.html',
    styleUrls: ['./filter-value-option.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterValueOptionComponent implements OnInit, OnDestroy {
    @Input() filters: FilterModel[];

    @Input('selectedFilter')
    set selectedFilterSetter(selectedFilter: FilterModel) {
        this.formGroup.reset();
        this.selectedFilter = selectedFilter;

        if (this.selectedFilter.filterRepresentation === FilterRepresentation.RADIO_GROUP) {
            this.formGroup.controls[controlNames.input]
                .setValue(this.selectedFilter.parameterValues[0][0], { emitEvent: false });
        }
    }

    controlNames = controlNames;
    FilterRepresentation = FilterRepresentation;
    formGroup = this.formBuilder.group({
        [controlNames.input]: [],
        [controlNames.not]: [],
        [controlNames.operator]: []
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

    private subscribeToFormChanges() {
        this.formGroup.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(value => console.log(value));
    }
}
