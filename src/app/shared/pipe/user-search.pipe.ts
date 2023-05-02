import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user';

@Pipe({ name: 'userSearch' })
export class UserSearchPipe implements PipeTransform {
  transform(allUsers: User[], text: string) {
    if (text === "") {
        return allUsers;
    }
    text = text.toLowerCase();
    return allUsers.filter(user => user.name?.toLowerCase().includes(text));
  }
}