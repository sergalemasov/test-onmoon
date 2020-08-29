import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class DrawerService {
    isShown$: Observable<boolean>;

    private isShownSource$ = new BehaviorSubject<boolean>(false);

    constructor() {
        this.isShown$ = this.isShownSource$.asObservable();
    }

    show() {
        this.isShownSource$.next(true);
    }

    hide() {
        this.isShownSource$.next(false);
    }
}
