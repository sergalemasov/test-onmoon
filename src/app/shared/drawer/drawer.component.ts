import { Component, ChangeDetectionStrategy, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { DrawerService } from './drawer.service';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'drawer',
    templateUrl: './drawer.component.html',
    styleUrls: ['./drawer.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerComponent implements AfterViewInit, OnDestroy {
    @ViewChild('drawer', {static: false}) drawer: MatDrawer;

    private destroy$ = new Subject<void>();

    constructor(private drawerService: DrawerService,
                private changeDetectorRef: ChangeDetectorRef) {}

    ngAfterViewInit() {
        this.subscribeToVisibility();
    }

    ngOnDestroy() {
        this.destroy$.next();
    }

    private subscribeToVisibility() {
        this.drawerService.isShown$
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(isShown => {
                if (isShown) {
                    this.drawer.open();
                } else {
                    this.drawer.close();
                }

                this.changeDetectorRef.markForCheck();
            });
    }
}
