import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, mapTo, catchError, map } from 'rxjs/operators';
import { FilterDto, FilterModel } from 'app/interfaces';
import { of } from 'rxjs';
import { FilterConverter } from 'app/converters/filter.converter';

@Injectable()
export class FiltersService {
    filters: FilterModel[] = [];

    constructor(private httpClient: HttpClient, private filterConverter: FilterConverter) {}

    init$() {
        return this.httpClient.get<{filters: FilterDto[]}>('https://fronttest.onmoon.io/filters.json')
            .pipe(
                map(({filters}: {filters: FilterDto[]}) => filters.map(filter => this.filterConverter.fromDto(filter))),
                tap(filters => this.filters = filters),
                tap(filters => console.log(filters)),
                mapTo(true),
                catchError(error => {
                    console.error(error);

                    return of(false);
                })
            );
    }
}
