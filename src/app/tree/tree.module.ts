import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { TreeComponent } from './tree.component';
import { LeafComponent } from './leaf/leaf.component';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule
    ],
    declarations: [
        LeafComponent,
        TreeComponent
    ],
    exports: [TreeComponent]
})
export class TreeModule {
}
