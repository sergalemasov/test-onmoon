import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LeafOptionsService } from 'app/services/leaf-options/leaf-options.service';
import { Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Leaf, FilterModel } from 'app/interfaces';
import { FormControl } from '@angular/forms';
import { LeafType } from 'app/enums';
import { FiltersService } from 'app/services/filters/filters.service';
import { TreeService } from 'app/services/tree/tree.service';
import { LeafTypeFormValue } from './interfaces/leaf-type-form-value.interface';
import { FilterRepresentation } from 'app/enums/filter-representation.enum';
import { FilterValueFormValue } from './interfaces/filter-value-form-value.interface';

@Component({
    selector: 'leaf-options',
    templateUrl: './leaf-options.component.html',
    styleUrls: ['./leaf-options.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeafOptionsComponent implements OnInit, OnDestroy {
    leafTypeControl = new FormControl();
    filterValueControl = new FormControl();
    selectedFilterControl = new FormControl();

    isFilterTypeOptionShown$ = new BehaviorSubject<boolean>(false);
    isFilterValueOptionShown$ = new BehaviorSubject<boolean>(false);
    selectedFilter$ = new BehaviorSubject<FilterModel>(null);

    get filters(): FilterModel[] {
        return this.filtersService.filters;
    }

    private clonedLeaf: Leaf;
    private destroy$ = new Subject<void>();

    constructor(private leafOptionsService: LeafOptionsService,
                private changeDetectorRef: ChangeDetectorRef,
                private filtersService: FiltersService,
                private treeService: TreeService) {}

    ngOnInit() {
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
                this.clonedLeaf = { ...leaf };

                this.setLeafTypeValueOnLeaf(leaf);
                this.updateFilterTypeOptionVisibility();

                this.setSelectedFilterOnLeaf(leaf);
                this.setFilterValueOnLeaf(leaf);

                this.changeDetectorRef.markForCheck();
            });
    }

    private setLeafTypeValueOnLeaf(leaf: Leaf) {
        if (!leaf) {
            this.leafTypeControl.setValue({
                name: null,
                type: LeafType.NONE
            }, {emitEvent: false});

            return;
        }

        if (leaf.type === LeafType.EXPRESSION) {
            this.leafTypeControl.setValue({
                name: leaf.name,
                type: leaf.type
            }, {emitEvent: false});
        } else {
            this.leafTypeControl.setValue({
                name: null,
                type: leaf.type
            }, {emitEvent: false});
        }
    }

    private setSelectedFilterOnLeaf(leaf: Leaf) {
        if (!leaf
            || leaf.type !== LeafType.FILTER) {
            this.selectedFilterControl.setValue(null, {emitEvent: false});
            this.selectedFilter$.next(null);
        } else {
            const foundFilter = this.filters.find(filter => filter.id === leaf.filterId);

            this.selectedFilter$.next(foundFilter);
            this.selectedFilterControl.setValue(
                foundFilter,
                {emitEvent: false}
            );
        }
    }

    private setFilterValueOnLeaf(leaf: Leaf) {
        if (!leaf || leaf.type === LeafType.EXPRESSION) {
            this.filterValueControl.setValue({
                not: null,
                input: null,
                operator: null
            }, { emitEvent: false });
        } else {
            this.filterValueControl.setValue({
                not: leaf.not,
                input: leaf.value,
                operator: leaf.operator
            }, { emitEvent: false });
        }
    }

    private subscribeToFormChanges() {
        this.filterValueControl.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.updateLeafAsFilter());

        this.leafTypeControl.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(value => this.onLeafTypeControlChange(value));

        this.selectedFilterControl.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(selectedFilter => {
                this.selectedFilter$.next(selectedFilter);
                this.updateLeafAsFilter();
            });

        combineLatest(this.isFilterTypeOptionShown$, this.selectedFilter$)
            .pipe(takeUntil(this.destroy$))
            .subscribe(([isFilterTypeOptionShown, selectedFilter]: [boolean, FilterModel]) => {
                this.isFilterValueOptionShown$.next(isFilterTypeOptionShown && !!selectedFilter);
            });
    }

    private updateFilterTypeOptionVisibility() {
        this.isFilterTypeOptionShown$.next(this.leafTypeControl.value.type === LeafType.FILTER);
    }

    private onLeafTypeControlChange(leafTypeFormValue: LeafTypeFormValue) {
        this.updateFilterTypeOptionVisibility();

        if (leafTypeFormValue.type === LeafType.EXPRESSION) {
            const patch: Partial<Leaf> = {
                name: leafTypeFormValue.name,
                filterRepresentation: FilterRepresentation.NONE,
                type: LeafType.EXPRESSION
            };

            if (this.clonedLeaf.hasChildren) {
                this.treeService.updateAndRestoreLeafs(
                    this.clonedLeaf.id,
                    this.clonedLeaf.firstChild,
                    this.clonedLeaf.secondChild,
                    patch
                );
            } else {
                this.treeService.updateAndAddLeafs(
                    this.clonedLeaf.id,
                    patch
                );
            }
        } else {
            this.updateLeafAsFilter();
        }
    }

    private updateLeafAsFilter() {
        if (!this.selectedFilterControl.value) {
            this.treeService.restoreDefaults(this.clonedLeaf.id);

            return;
        }

        const {
            name,
            filterRepresentation,
            id
        } = this.selectedFilterControl.value as FilterModel;

        const {
            not,
            input,
            operator
        } = this.filterValueControl.value as FilterValueFormValue;

        this.treeService.updateLeafById(this.clonedLeaf.id, {
            name,
            not,
            value: input,
            operator,
            filterRepresentation,
            filterId: id,
            type: LeafType.FILTER,
            hasChildren: false,
            firstChild: undefined,
            secondChild: undefined
        });
    }
}
