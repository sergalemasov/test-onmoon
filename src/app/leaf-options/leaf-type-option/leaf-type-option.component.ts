import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LeafType } from 'app/enums';
import { controlNames } from '../consts/control-names.const';

@Component({
    selector: 'leaf-type-option',
    templateUrl: './leaf-type-option.component.html',
    styleUrls: ['./leaf-type-option.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeafTypeOptionComponent {
    @Input() parentFormGroup: FormGroup;

    controlNames = controlNames;

    options = [
        {
            name: 'И',
            value: {
                name: 'И',
                type: LeafType.EXPRESSION
            }
        },
        {
            name: 'ИЛИ',
            value: {
                name: 'И',
                type: LeafType.EXPRESSION
            }
        },
        {
            name: 'Фильтр',
            value: {
                name: null,
                type: LeafType.FILTER
            }
        }
    ];
}
