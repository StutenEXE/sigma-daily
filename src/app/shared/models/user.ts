export class User {
    uid!: string;
    name!: string | null;
    sigma!: number;
    friends: Object = {};
}