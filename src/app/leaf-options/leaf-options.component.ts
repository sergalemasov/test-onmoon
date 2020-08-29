import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LeafOptionsService } from 'app/services/leaf-options/leaf-options.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Leaf, FilterModel } from 'app/interfaces';
import { FormGroup, FormBuilder } from '@angular/forms';
import { controlNames } from './consts/control-names.const';
import { LeafType } from 'app/enums';
import { FiltersService } from 'app/services/filters/filters.service';

@Component({
    selector: 'leaf-options',
    templateUrl: './leaf-options.component.html',
    styleUrls: ['./leaf-options.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeafOptionsComponent implements OnInit, OnDestroy {
    leaf: Leaf;
    formGroup: FormGroup;

    isFilterTypeOptionShown$ = new BehaviorSubject<boolean>(false);
    isFilterValueOptionShown$ = new BehaviorSubject<boolean>(false);
    selectedFilter$ = new BehaviorSubject<FilterModel>(null);

    get filters(): FilterModel[] {
        return this.filtersService.filters;
    }

    private destroy$ = new Subject<void>();

    constructor(private leafOptionsService: LeafOptionsService,
                private changeDetectorRef: ChangeDetectorRef,
                private formBuilder: FormBuilder,
                private filtersService: FiltersService) {}

    ngOnInit() {
        this.createFormGroup();
        this.subscribeToFormChanges();
        this.subscribeToLeaf();
    }

    ngOnDestroy() {
        this.destroy$.next();
    }

    cancelLeafSetup() {
        this.leafOptionsService.cancelLeafSetup();
    }

    private subscribeToLeaf() {
        this.leafOptionsService.leaf$
            .pipe(takeUntil(this.destroy$))
            .subscribe(leaf => {
                this.leaf = leaf;
                this.changeDetectorRef.markForCheck();
            });
    }

    private subscribeToFormChanges() {
        this.formGroup.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(value => this.onFormValueChange(value));
    }

    private createFormGroup() {
        this.formGroup = this.formBuilder.group({
            [controlNames.leafType]: [],
            [controlNames.selectedFilter]: [],
            [controlNames.filterValue]: [],
        });
    }

    private onFormValueChange(value: any) {
        const isFilterTypeOptionShown = value.leafType && value.leafType.type === LeafType.FILTER;
        const selectedFilter = value.selectedFilter;

        this.isFilterTypeOptionShown$.next(isFilterTypeOptionShown);
        this.isFilterValueOptionShown$.next(isFilterTypeOptionShown && selectedFilter);
        this.selectedFilter$.next(selectedFilter);


        console.log(value);
    }
}
