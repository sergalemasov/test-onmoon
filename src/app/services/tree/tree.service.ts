import { Injectable } from '@angular/core';
import { Leaf } from 'app/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { LeafType } from 'app/enums';
import { IdGeneratorService } from '../id-generator/id-generator.service';
import { FilterRepresentation } from 'app/enums/filter-representation.enum';

@Injectable()
export class TreeService {
    tree$: Observable<Leaf>;

    private treeSource$ = new BehaviorSubject<Leaf>(this.createNewLeaf());

    constructor(private idGeneratorService: IdGeneratorService) {
        this.tree$ = this.treeSource$.asObservable();
    }

    addChildLeafs(leafId: string) {
        const leaf = this.findLeaf(leafId);

        this.updateLeaf(
            leaf,
            {
                firstChild: this.createNewLeaf(leaf),
                secondChild: this.createNewLeaf(leaf)
            }
        );
    }

    removeChildLeafs(leafId: string) {
        const leaf = this.findLeaf(leafId);

        this.updateLeaf(
            leaf,
            {
                firstChild: undefined,
                secondChild: undefined
            }
        );
    }

    updateLeaf(leaf: Leaf, patch: Partial<Leaf>) {
        const parent = leaf.parent;

        if (!parent) {
            this.treeSource$.next({
                ...leaf,
                ...patch
            });

            return;
        }

        if (parent.firstChild === leaf) {
            parent.firstChild = {
                ...leaf,
                ...patch
            };
        } else {
            parent.secondChild = {
                ...leaf,
                ...patch
            };
        }

        this.treeSource$.next(this.treeSource$.getValue());
    }

    private createNewLeaf(parent?: Leaf): Leaf {
        return {
            value: 'Настроить фильтр',
            type: LeafType.FILTER,
            id: this.idGeneratorService.generate(),
            filterRepresentation: FilterRepresentation.NONE,
            parent
        };
    }

    private findLeaf(leafId: string) {
        const finder = (currentLeaf: Leaf) => {
            if (!currentLeaf) {
                return null;
            }

            if (currentLeaf.id === leafId) {
                return currentLeaf;
            }

            return finder(currentLeaf.firstChild) || finder(currentLeaf.secondChild);
        }

        return finder(this.treeSource$.getValue());
    }
}
