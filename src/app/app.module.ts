import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { TreeModule } from './tree/tree.module';
import { FiltersService } from './services/filters/filters.service';
import { WindowService } from './services/window/window.service';
import { LeafOptionsService } from './services/leaf-options/leaf-options.service';
import { LeafOptionsModule } from './leaf-options/leaf-options.module';
import { DrawerModule } from './shared/drawer/drawer.module';
import { IdGeneratorService } from './services/id-generator/id-generator.service';
import { TreeService } from './services/tree/tree.service';
import { FilterConverter } from './converters/filter.converter';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TreeModule,
    LeafOptionsModule,
    DrawerModule
  ],
  providers: [
    WindowService,
    FiltersService,
    LeafOptionsService,
    IdGeneratorService,
    TreeService,
    FilterConverter
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
