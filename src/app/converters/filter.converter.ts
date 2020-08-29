import {Injectable} from '@angular/core';
import { FilterDto, FilterModel } from 'app/interfaces';
import { FilterRepresentation } from 'app/enums/filter-representation.enum';

@Injectable()
export class FilterConverter {
    fromDto(filterDto: FilterDto): FilterModel {
        return {
            ...filterDto,
            filterRepresentation: this.setupFilterRepresentation(filterDto)
        }
    }

    private setupFilterRepresentation(filterDto: FilterDto): FilterRepresentation {
        const { operators, parameterCount } = filterDto;

        if (operators.length === 1 && operators[0] === '=') {
            return FilterRepresentation.RADIO_GROUP;
        }

        if (operators.length === 2 && ['-', '+'].every(operator => operators.includes(operator))) {
            return FilterRepresentation.CHECKBOX;
        }

        if (operators.length > 1) {
            if (parameterCount === 1) {
                return FilterRepresentation.INPUT_WITH_OPERATOR;
            } else if (parameterCount > 1) {
                return FilterRepresentation.AUTOCOMPLETE_WITH_OPERATOR;
            }
        }

        return FilterRepresentation.NONE;
    }
}
