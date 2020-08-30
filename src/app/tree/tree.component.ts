import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Leaf } from 'app/interfaces';
import { Observable } from 'rxjs';
import { TreeService } from 'app/services/tree/tree.service';
import { TreeConverter } from 'app/converters/tree.converter';

@Component({
    selector: 'tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent {
    tree$: Observable<Leaf>

    constructor(private treeService: TreeService, private treeConverter: TreeConverter) {}

    ngOnInit() {
        this.tree$ = this.treeService.tree$;
    }

    onSaveClick() {
        const tree = this.treeService.getTree();

        try {
            console.log(JSON.stringify(this.treeConverter.toDto(tree), null, 2));
        } catch (e) {
            console.error(e.message);
        }
    }
}
