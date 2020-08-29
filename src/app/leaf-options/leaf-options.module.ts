import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { LeafOptionsComponent } from './leaf-options.component';
import { LeafTypeOptionComponent } from './leaf-type-option/leaf-type-option.component';
import { FilterTypeOptionComponent } from './filter-type-option/filter-type-option.component';
import { FilterValueOptionComponent } from './filter-value-option/filter-value-option.component';
import { OperatorPipe } from 'app/shared/pipes/operator.pipe';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        MatInputModule,
        MatAutocompleteModule
    ],
    providers: [],
    declarations: [
        LeafOptionsComponent,
        LeafTypeOptionComponent,
        FilterTypeOptionComponent,
        FilterValueOptionComponent,
        OperatorPipe
    ],
    exports: [LeafOptionsComponent]
})
export class LeafOptionsModule {
}
