import { User } from "./user";

export class userParams{
  gender: string;
  pageNumber = 1;
  pageSize = 5;
  minAge = 18;
  maxAge = 100;
  orderBy = "lastActive"

  constructor(user: User){
    this.gender = user.gender === "male"? 'female' : 'male';
  }
}
