import { LeafType } from 'app/enums';
import { FilterRepresentation } from 'app/enums/filter-representation.enum';
import { ChangeDetectorRef } from '@angular/core';

export interface Leaf {
    name: string;
    id: string;
    type: LeafType;
    filterRepresentation: FilterRepresentation;
    hasChildren: boolean;
    not: boolean;
    filterId?: number;
    value?: string | boolean;
    operator?: string;
    firstChild?: Leaf;
    secondChild?: Leaf;
}
