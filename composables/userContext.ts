export type User = {
  name: string;
  email: string;
  age: number;
};

class UserContext {
  user = reactive<User>({
    name: "",
    email: "",
    age: 0,
  });

  constructor() {}

  setUser(user: User) {
    this.user = user;
  }

  clearUser() {
    this.user.name = "";
    this.user.email = "";
    this.user.age = 0;
  }
}

const userContext = new UserContext();
export default userContext;
