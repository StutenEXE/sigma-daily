import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { UserSearchPipe } from "./pipe/user-search.pipe";
import { FriendSearchPipe } from "./pipe/user-search.pipe copy";
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [ 
      SearchBarComponent,
      UserSearchPipe,
      FriendSearchPipe,
      LoaderComponent
    ],
    exports: [
      SearchBarComponent,
      UserSearchPipe,
      FriendSearchPipe,
      LoaderComponent
    ]
})
export class SharedModule { }