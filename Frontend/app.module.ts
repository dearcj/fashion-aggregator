///<reference path="../typings/index.d.ts"/>

import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {DataTableDirectives} from 'angular2-datatable/datatable';

@NgModule({
  imports: [BrowserModule],
  declarations: [DataTableDirectives]
})

export class AppModule {
}
