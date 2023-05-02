import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { UserSearchPipe } from "./pipe/user-search.pipe";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [ 
      SearchBarComponent,
      UserSearchPipe
    ],
    exports: [
      SearchBarComponent,
      UserSearchPipe
    ]
})
export class SharedModule { }