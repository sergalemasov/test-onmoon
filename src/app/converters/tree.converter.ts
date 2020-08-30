import {Injectable} from '@angular/core';
import { Leaf } from 'app/interfaces';
import { LeafType } from 'app/enums';
import { Expression } from 'app/enums/expression.enum';
import { FilterRepresentation } from 'app/enums/filter-representation.enum';

@Injectable()
export class TreeConverter {
    toDto(root: Leaf) {
        const result = {
            constructor: {}
        };

        const fillNode = (currentNode, leaf: Leaf) => {
            if (leaf.type === LeafType.FILTER) {
                if (leaf.filterId === undefined) {
                    throw new Error('Настройте все фильтры.');
                }

                if (leaf.operator === undefined) {
                    throw new Error('Выберите все условия для фильров.');
                }

                if (leaf.value === undefined) {
                    throw new Error('Укажите все значения для фильтров.')
                }

                const nodeValue = {
                    filterId: leaf.filterId,
                    operator: leaf.operator,
                    parameters: leaf.filterRepresentation === FilterRepresentation.CHECKBOX
                        ? []
                        : [leaf.value]
                };

                if (leaf.not) {
                    currentNode.type = 'not';
                    currentNode.arg1 = nodeValue
                    currentNode.arg2 = null;
                } else {
                    Object.assign(currentNode, nodeValue);
                }
            } else if (leaf.type === LeafType.EXPRESSION) {
                currentNode.type = leaf.name === Expression.AND
                    ? 'and'
                    : 'or'
                currentNode.arg1 = {};
                currentNode.arg2 = {};

                fillNode(currentNode.arg1, leaf.firstChild);
                fillNode(currentNode.arg2, leaf.secondChild);
            } else {
                throw new Error('Настройте все фильтры.');
            }
        }

        fillNode(result.constructor, root);

        return result;
    }
}


// {
//     "contructor": {
//       "type": "or",
//       "arg1": {
//         "type": "and",
//         "arg1": {
//           "filerId": 1,
//           "operator": ">",
//           "parameters": [18]
//           },
//         "arg2": {
//           "filerId": 2,
//           "operator": "=",
//           "parameters": ["М"]
//           }
//       },
//       "arg2": {
//         "type": "not",
//         "arg1": {
//           "filerId": 4,
//           "operator": "+",
//           "parameters": []
//           },
//         "arg2": null
//       }
//     }
//   }
