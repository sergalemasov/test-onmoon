import { Injectable } from '@angular/core';
import { Leaf } from 'app/interfaces';
import { DrawerService } from 'app/shared/drawer/drawer.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LeafOptionsService {
    leaf$: Observable<Leaf>;

    private leafSource$ = new BehaviorSubject<Leaf>(null);

    constructor(private drawerService: DrawerService) {
        this.leaf$ = this.leafSource$.asObservable();
    }

    openLeafOptions(leaf: Leaf) {
        this.drawerService.show();

        this.leafSource$.next(leaf);
    }

    saveLeaf() {
        this.drawerService.hide();
    }

    cancelLeafSetup() {
        this.drawerService.hide();
    }
}
