import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DrawerComponent } from './drawer.component';
import { DrawerService } from './drawer.service';

@NgModule({
    imports: [MatSidenavModule],
    providers: [DrawerService],
    declarations: [DrawerComponent],
    exports: [DrawerComponent]
})
export class DrawerModule {
}
