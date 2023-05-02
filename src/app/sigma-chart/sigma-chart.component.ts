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
  allOtherUsers: User[] = [];

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

    this.getAllUsers()

    this.numbers = Array(this.NUMBER_OF_SIGMAS).fill(null).map((x, i) => i);
    console.log(this.numbers)
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

            this.allFriends.push(user);
          }

          // else but not current user
          else if (this.user.uid !== user.uid) {
            this.allOtherUsers.push(user);
          }
        })
      }
    );

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

  setSelected(event: MouseEvent, sigmaIndex: number) {
    if (this.user === undefined) {
      return;
    }
    console.log(this.user);
    this.user.sigma = sigmaIndex;
    this.userService.updateSigma(sigmaIndex);
  }

  addFriend(newFriend: User) {
    this.userService.addFriend(newFriend);
    this.allOtherUsers.splice(this.allOtherUsers.indexOf(newFriend), 1);
    this.allFriends.push(newFriend);
  }

  removeFriend(oldFriend: User) {
    this.userService.removeFriend(oldFriend);
    this.allFriends.splice(this.allOtherUsers.indexOf(oldFriend), 1);
    this.allOtherUsers.push(oldFriend);
  }
}
