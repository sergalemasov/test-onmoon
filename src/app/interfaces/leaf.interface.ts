import { LeafType } from 'app/enums';
import { FilterRepresentation } from 'app/enums/filter-representation.enum';

export interface Leaf {
    value: string;
    id: string;
    type: LeafType;
    filterRepresentation: FilterRepresentation;
    operator?: string;
    firstChild?: Leaf;
    secondChild?: Leaf;
    parent?: Leaf;
}
