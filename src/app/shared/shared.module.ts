import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { UserSearchPipe } from "./pipe/user-search.pipe";
import { FriendSearchPipe } from "./pipe/user-search.pipe copy";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [ 
      SearchBarComponent,
      UserSearchPipe,
      FriendSearchPipe
    ],
    exports: [
      SearchBarComponent,
      UserSearchPipe,
      FriendSearchPipe
    ]
})
export class SharedModule { }