import { Injectable } from '@angular/core';

function _window(): Window {
    return window;
}

@Injectable()
export class WindowService {
    public getNativeWindow(): Window {
        return _window();
    }
}
