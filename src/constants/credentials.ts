import { CheckoutUser } from "../models/checkoutUser";

const Creds = {
  validUser: "standard_user",
  lockedUser: "locked_out_user",
  password: "secret_sauce",
};

export default Creds;

export const CheckoutUserData = {
  user1(): CheckoutUser {
    return {
      firstName: "Jane",
      lastName: "Doe",
      zip: "123456",
    };
  },
  user2(): CheckoutUser {
    return {
      firstName: "John",
      lastName: "Doe",
      zip: "567890",
    };
  },
};
