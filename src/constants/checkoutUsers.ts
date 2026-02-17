import { CheckoutUser } from '../models/checkoutUser';

export const CheckoutUserData = {
  jane(): CheckoutUser {
    return {
      firstName: 'Jane',
      lastName: 'Doe',
      zip: '123456',
    };
  },
  john(): CheckoutUser {
    return {
      firstName: 'John',
      lastName: 'Doe',
      zip: '567890',
    };
  },
};
