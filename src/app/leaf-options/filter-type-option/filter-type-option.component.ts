import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterModel } from 'app/interfaces';
import { controlNames } from '../consts/control-names.const';

@Component({
    selector: 'filter-type-option',
    templateUrl: './filter-type-option.component.html',
    styleUrls: ['./filter-type-option.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterTypeOptionComponent {
    @Input() parentFormGroup: FormGroup;
    @Input() filters: FilterModel[];

    controlNames = controlNames;
}
