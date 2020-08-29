import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Leaf } from 'app/interfaces';
import { Observable } from 'rxjs';
import { TreeService } from 'app/services/tree/tree.service';

@Component({
    selector: 'tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent {
    tree$: Observable<Leaf>

    constructor(private treeService: TreeService) {}

    ngOnInit() {
        this.tree$ = this.treeService.tree$;
    }
}
