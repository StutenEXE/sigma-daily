import { Pipe, PipeTransform } from '@angular/core';
import { Friend } from '../models/friend';

@Pipe({ name: 'friendSearch' })
export class FriendSearchPipe implements PipeTransform {
  transform(allFriends: Friend[], text: string) {
    if (text === "") {
        return allFriends;
    }
    text = text.toLowerCase();
    return allFriends.filter(friend => friend.data.name?.toLowerCase().includes(text));
  }
}