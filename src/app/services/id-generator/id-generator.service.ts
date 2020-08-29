import { Injectable } from '@angular/core';
import { nanoid } from 'nanoid'

@Injectable()
export class IdGeneratorService {
    generate(): string {
        return nanoid();
    }
}
