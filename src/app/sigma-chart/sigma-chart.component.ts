import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user';
import { AuthService } from '../shared/services/auth.service';
import { UsersService } from '../shared/services/users.service';

@Component({
  selector: 'app-sigma-chart',
  templateUrl: './sigma-chart.component.html',
  styleUrls: ['./sigma-chart.component.scss']
})
export class SigmaChartComponent implements OnInit {
  readonly DEFAULT_STROKE_COLOR =  "#1da3fd";
  readonly DEFAULT_FRIEND_STROKE_COLOR = "#ffffff";

  readonly NUMBER_OF_SIGMAS = 130;

  readonly X_STEP = (490 * 100) / 4960;
  readonly Y_STEP = (490 * 100) / 7016;

  readonly X_MARGIN = (35 * 100) / 4960;
  readonly Y_MARGIN = (573 * 100) / 7016;

  // readonly X_SIGMA_SIZE = (480 * 100) / 4960;
  // readonly Y_SIGMA_SIZE = (480 * 100) / 7016;

  numbers!: number[];
  user!: User;

  allFriends: User[] = [];
  shownFriendsUids: string[] = [];
  allOtherUsers: User[] = [];

  friendColors!: Map<string, string>;

  filter: string = "";

  constructor(private auth: AuthService,
    private userService: UserService,
    private usersService: UsersService) { }

  ngOnInit(): void {
    this.auth.updateCurrentUser();
    this.userService.getUser().then(
      data => {
        this.user = data.val();
      }
    );

    this.getAllUsers();

    this.numbers = Array(this.NUMBER_OF_SIGMAS).fill(null).map((x, i) => i);
  }

  getAllUsers() {
    this.friendColors = new Map<string, string>();
    // We retreive all susers that are neither friends or the current user
    this.usersService.getAllUsers().then(
      data => {
        data.forEach((userdata) => {
          let user = userdata.val() as User;
          // If friend
          if (this.user.friends !== undefined &&
            this.user.uid !== user.uid &&
            Object.keys(this.user.friends).includes(user.uid)) {

            this.allFriends.push(user);

            this.friendColors.set(user.uid, "#fff");
            this.shownFriendsUids.push(user.uid);
          }

          // else but not current user
          else if (this.user.uid !== user.uid) {
            this.allOtherUsers.push(user);
          }
        })
      }
    );
  }

  showSigma(i: number) {
    for(let friend of this.allFriends) {
      if (friend.sigma === i) {
        console.log(this.shownFriendsUids.includes(friend.uid));
        return this.shownFriendsUids.includes(friend.uid);
      }
    }
    return this.user != undefined  && this.user.sigma == i;
  }

  getStrokeColor(i: number) {
    for(let friend of this.allFriends) {
      if (friend.sigma === i) {
        return this.friendColors.get(friend.uid);
      }
    }
    return this.DEFAULT_STROKE_COLOR;
  }

  calculateCoordsArea(i: number) {
    let x = i % 10;
    let y = Math.floor(i / 10);
    // console.log(i + " = (" + x + ", " + y + ")")
    // let x1 = 35 + 490 * x;
    // let y1 = 573 + 490 * y;
    let x1 = this.X_MARGIN + x * this.X_STEP;
    let y1 = this.Y_MARGIN + y * this.Y_STEP;
    return {
      x: x1,
      y: y1
    };
  }

  setSelected(sigmaIndex: number) {
    if (this.user === undefined) {
      return;
    }
    this.user.sigma = sigmaIndex;
    this.userService.updateSigma(sigmaIndex);
  }

  setRandom() {
    this.setSelected(Math.floor(Math.random() * 129))
  }

  addFriend(newFriend: User) {
    this.userService.addFriend(newFriend);
    this.allOtherUsers.splice(this.allOtherUsers.indexOf(newFriend), 1);
    this.allFriends.push(newFriend);
    this.shownFriendsUids.push(newFriend.uid);
    this.friendColors.set(newFriend.uid, this.DEFAULT_FRIEND_STROKE_COLOR);
  }

  removeFriend(oldFriend: User) {
    this.userService.removeFriend(oldFriend);
    this.allFriends.splice(this.allOtherUsers.indexOf(oldFriend), 1);
    this.shownFriendsUids.splice(this.shownFriendsUids.indexOf(oldFriend.uid), 1);
    this.friendColors.delete(oldFriend.uid);
    this.allOtherUsers.push(oldFriend);
  }

  setFilter(newFilter: string) {
    this.filter = newFilter;
  }

  toggleSigmaVisibility(friendUid: string, event: MouseEvent) {
    let button = event.target as HTMLElement;
    if (button.getAttribute('src') === "../../assets/eye-open-svg.svg") {
      button.setAttribute('src', "../../assets/eye-closed-svg.svg");
      this.shownFriendsUids.splice(this.shownFriendsUids.indexOf(friendUid), 1)
    }
    else {
      button.setAttribute('src', '../../assets/eye-open-svg.svg');
      this.shownFriendsUids.push(friendUid);
    } 
  }

  setFriendColor(friendUid: string, event: any) {
    this.friendColors.set(friendUid, event.target.value);
  }
}
