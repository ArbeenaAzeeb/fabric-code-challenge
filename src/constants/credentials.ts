import { CheckoutUser } from "../models/checkoutUser";

const LoginUserCredentials = {
  validUser: "standard_user",
  lockedUser: "locked_out_user",
  password: "secret_sauce",
};

export default LoginUserCredentials;

export const CheckoutUserData = {
  jane(): CheckoutUser {
    return {
      firstName: "Jane",
      lastName: "Doe",
      zip: "123456",
    };
  },
  john(): CheckoutUser {
    return {
      firstName: "John",
      lastName: "Doe",
      zip: "567890",
    };
  },
};
