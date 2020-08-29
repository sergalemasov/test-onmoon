import { Pipe, PipeTransform } from '@angular/core';
import { operatorMap } from './operator-map.const';

@Pipe({
    name: 'operatorPipe'
})
export class OperatorPipe implements PipeTransform {
    public transform(operator: string) {
        return operatorMap[operator];
    }
}
