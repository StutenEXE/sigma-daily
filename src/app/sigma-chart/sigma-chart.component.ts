import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user';
import { AuthService } from '../shared/services/auth.service';
import { UsersService } from '../shared/services/users.service';
import { Friend } from '../shared/models/friend';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sigma-chart',
  templateUrl: './sigma-chart.component.html',
  styleUrls: ['./sigma-chart.component.scss']
})
export class SigmaChartComponent implements OnInit {
  readonly DEFAULT_STROKE_COLOR = "#1da3fd";
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

  allFriends: Friend[] = [];
  allOtherUsers: User[] = [];

  filter: string = "";

  sigmaChartLoading: boolean = true;

  onSigmaChartLoad() {
    this.sigmaChartLoading = false;
  }

  constructor(private auth: AuthService,
    private userService: UserService,
    private usersService: UsersService,
    private router: Router) { }

  ngOnInit(): void {
    if (!this.auth.userIsConnected()) {
      this.router.navigate(['/']);
    }
    this.auth.updateCurrentUser();
    this.userService.getUser().then(
      data => {
        this.user = data.val();
      }
    );

    this.getAllUsers();

    this.numbers = Array(this.NUMBER_OF_SIGMAS).fill(null).map((x, i) => i);
  }

  initNewFriend(data: User) {
    let friend = new Friend();
    friend.data = data;
    friend.color = this.getRandomHexColor();
    friend.showSigma = true;
    return friend;
  }

  getRandomHexColor() {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getAllUsers() {
    // We retreive all susers that are neither friends or the current user
    this.usersService.getAllUsers().then(
      data => {
        data.forEach((userdata) => {
          let user = userdata.val() as User;
          // If friend
          if (this.user.friends !== undefined &&
            this.user.uid !== user.uid &&
            Object.keys(this.user.friends).includes(user.uid)) {

            this.allFriends.push(this.initNewFriend(user));
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
    for (let friend of this.allFriends) {
      if (friend.data.sigma === i && friend.showSigma) {
        return friend.showSigma;
      }
    }
    return this.user != undefined && this.user.sigma == i;
  }

  getStrokeStyle(i: number) {
    for (let friend of this.allFriends) {
      if (friend.data.sigma === i && friend.showSigma) {
        return {stroke: friend.color};
      }
    }
    return {stroke: this.DEFAULT_STROKE_COLOR, zindex: 100};
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
    this.allFriends.push(this.initNewFriend(newFriend));
  }

  removeFriend(oldFriend: Friend) {
    this.userService.removeFriend(oldFriend.data);
    this.allFriends.forEach((friend, index) => {
      if (friend.data.uid === oldFriend.data.uid) {
        this.allFriends.splice(index, 1);
      }
    });
    this.allOtherUsers.push(oldFriend.data);
  }

  setFilter(newFilter: string) {
    this.filter = newFilter.trim();
  }

  toggleSigmaVisibility(friend: Friend) {
    friend.showSigma = !friend.showSigma;
  }

  setFriendColor(friend: Friend, event: any) {
    friend.color = event.target.value;
  }
}
