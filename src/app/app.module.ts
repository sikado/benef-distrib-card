import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ObjEditorComponent } from './components/obj-editor/obj-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from '@iplab/ngx-color-picker';
import { CardDesignerComponent } from './components/card-designer/card-designer.component';
import { DataImportComponent } from './components/data-import/data-import.component';
import { CardExportComponent } from './components/card-export/card-export.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [
    AppComponent,
    ObjEditorComponent,
    CardDesignerComponent,
    DataImportComponent,
    CardExportComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    ColorPickerModule,
    BsDropdownModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
