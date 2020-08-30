import { Injectable } from '@angular/core';
import { Leaf } from 'app/interfaces';
import { DrawerService } from 'app/shared/drawer/drawer.service';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class LeafOptionsService {
    leaf$: Observable<Leaf>;

    private leafSource$ = new Subject<Leaf>();

    constructor(private drawerService: DrawerService) {
        this.leaf$ = this.leafSource$.asObservable();
    }

    openLeafOptions(leaf: Leaf) {
        this.drawerService.show();

        this.leafSource$.next(leaf);
    }

    cancelLeafSetup() {
        this.leafSource$.next(null);

        this.drawerService.hide();
    }
}
