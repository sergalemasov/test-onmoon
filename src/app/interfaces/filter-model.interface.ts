import { FilterDto } from './filter-dto.interface';
import { FilterRepresentation } from 'app/enums/filter-representation.enum';

export interface FilterModel extends FilterDto {
    filterRepresentation: FilterRepresentation;
}
