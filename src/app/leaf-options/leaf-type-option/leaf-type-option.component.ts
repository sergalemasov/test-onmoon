import { Component, ChangeDetectionStrategy, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { LeafType } from 'app/enums';
import { LeafTypeFormValue } from '../interfaces/leaf-type-form-value.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Expression } from 'app/enums/expression.enum';

enum OptionValue {
    AND,
    OR,
    FILTER
}

@Component({
    selector: 'leaf-type-option',
    templateUrl: './leaf-type-option.component.html',
    styleUrls: ['./leaf-type-option.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LeafTypeOptionComponent),
            multi: true,
        }
    ]
})
export class LeafTypeOptionComponent implements OnInit, OnDestroy, ControlValueAccessor {
    options = [
        {
            name: Expression.AND,
            value: OptionValue.AND
        },
        {
            name: Expression.OR,
            value: OptionValue.OR
        },
        {
            name: 'Фильтр',
            value: OptionValue.FILTER
        }
    ];

    formControl = new FormControl();

    private onChange: (value: LeafTypeFormValue) => void;
    private destroy$ = new Subject<void>();

    ngOnInit() {
        this.subscribeToControlChanges();
    }

    ngOnDestroy() {
        this.destroy$.next();
    }

    writeValue(value: LeafTypeFormValue) {
        if (!value) {
            this.formControl.setValue(null, { emitEvent: false });

            return;
        }

        let optionValue: OptionValue;

        if (value.type === LeafType.EXPRESSION) {
            optionValue = value.name === Expression.AND
                ? OptionValue.AND
                : OptionValue.OR;
        } else if (value.type === LeafType.FILTER) {
            optionValue = OptionValue.FILTER
        } else {
            optionValue = null;
        }

        this.formControl.setValue(optionValue, { emitEvent: false });
    }

    registerOnChange(fn: (value: LeafTypeFormValue) => void) {
        this.onChange = fn;
    }

    registerOnTouched() {}

    private subscribeToControlChanges() {
        this.formControl.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(value => {
                let valueToEmit: LeafTypeFormValue;

                switch (value) {
                    case OptionValue.AND:
                        valueToEmit = {
                            name: Expression.AND,
                            type: LeafType.EXPRESSION
                        };
                        break;
                    case OptionValue.OR:
                        valueToEmit = {
                            name: Expression.OR,
                            type: LeafType.EXPRESSION
                        };
                        break;
                    case OptionValue.FILTER:
                        valueToEmit = {
                            name: null,
                            type: LeafType.FILTER
                        };
                        break;
                }

                this.onChange(valueToEmit);
            });
    }
}
