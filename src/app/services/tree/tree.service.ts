import { Injectable } from '@angular/core';
import { Leaf } from 'app/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { LeafType } from 'app/enums';
import { IdGeneratorService } from '../id-generator/id-generator.service';
import { FilterRepresentation } from 'app/enums/filter-representation.enum';

@Injectable()
export class TreeService {
    private static leafDefaults = {
        name: 'Настроить фильтр',
        type: LeafType.NONE,
        filterRepresentation: FilterRepresentation.NONE,
        hasChildren: false,
        not: false,
        firstChild: undefined,
        secondChild: undefined
    };

    tree$: Observable<Leaf>;

    private treeSource$ = new BehaviorSubject<Leaf>(this.createNewLeaf());

    constructor(private idGeneratorService: IdGeneratorService) {
        this.tree$ = this.treeSource$.asObservable();
    }

    getTree() {
        return this.treeSource$.getValue();
    }

    updateAndAddLeafs(leafId: string, patch: Partial<Leaf>) {
        const branch = this.findLeafBranch(leafId);

        const childrenPatch = branch[branch.length - 1].hasChildren
            ? {}
            : {
                hasChildren: true,
                firstChild: this.createNewLeaf(),
                secondChild: this.createNewLeaf()
            };

        this.updateBranch(
            branch,
            {
                ...childrenPatch,
                ...patch
            }
        );
    }

    updateAndRestoreLeafs(leafId: string, firstChild: Leaf, secondChild: Leaf, patch: Partial<Leaf>) {
        const branch = this.findLeafBranch(leafId);

        const childrenPatch = branch[branch.length - 1].hasChildren
            ? {}
            : {
                hasChildren: true,
                firstChild,
                secondChild
            };

        this.updateBranch(
            branch,
            {
                ...childrenPatch,
                ...patch
            }
        );
    }

    updateLeafById(leafId: string, patch: Partial<Leaf>) {
        const branch = this.findLeafBranch(leafId);

        this.updateBranch(branch, patch);
    }

    restoreDefaults(leafId: string) {
        const branch = this.findLeafBranch(leafId);

        this.updateBranch(branch, TreeService.leafDefaults);
    }

    private updateBranch(branch: Leaf[], patch: Partial<Leaf>) {
        if (branch.length < 2) {
            this.treeSource$.next({
                ...branch[0],
                ...patch
            });

            return;
        }

        for (let i = branch.length - 2; i >=0; i--) {
            const childToUpdate = branch[i].firstChild === branch[i + 1]
                ? 'firstChild'
                : 'secondChild';

            branch[i][childToUpdate] = {
                ...branch[i + 1],
            }

            if (i === branch.length - 2) {
                Object.assign(branch[i][childToUpdate], patch);
            }
        }

        this.treeSource$.next({...branch[0]});
    }

    private createNewLeaf(): Leaf {
        const newLeaf = {
            id: this.idGeneratorService.generate(),
            ...TreeService.leafDefaults
        };

        return newLeaf;
    }

    private findLeafBranch(leafId: string) {
        const branch = [];

        const addLeafToBranch = (currentLeaf: Leaf) => {
            if (!currentLeaf) {
                return false;
            }

            if (currentLeaf.id === leafId) {
                branch.unshift(currentLeaf);

                return true;
            }

            const isLeafFound = addLeafToBranch(currentLeaf.firstChild) || addLeafToBranch(currentLeaf.secondChild);

            if (isLeafFound) {
                branch.unshift(currentLeaf);
            }

            return isLeafFound;
        }

        addLeafToBranch(this.treeSource$.getValue());

        return branch;
    }
}
