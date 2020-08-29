import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FiltersService } from './services/filters/filters.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    isInitialized$: Observable<boolean>;

    constructor(private filtersService: FiltersService) {}

    ngOnInit() {
        this.isInitialized$ = this.filtersService.init$();
    }
}
