import { CheckoutUserData } from '../../../constants/checkoutUsers';
import Products from '../../../constants/products';
import CheckoutScreen from '../../../screens/checkout.screen';
import LoginScreen from '../../../screens/login.screen';
import ProductScreen from '../../../screens/product.screen';
import MenuScreen from '../../../screens/menu.screen';
import { ORIENTATIONS } from '../../../constants/orientation';
import { enforceOrientation } from '../../../utils/helpers';
import { testContext } from '../../../context/testContext';
import AllureHelper from '../../../utils/allurehelper';
import { ENV } from '../../../config/env';

for (const orientation of ORIENTATIONS) {
  describe(`Shopping flow in ${orientation}`, () => {
    before(async () => {
      testContext.orientation = orientation;
      await enforceOrientation();
    });

    it('should be able to place an order for multiple products', async () => {
      const productsToBuy = [Products.backpack, Products.bikeLight];
      const checkoutUser = CheckoutUserData.jane();

      AllureHelper.step('Login with valid credentials');
      await LoginScreen.login(ENV.STANDARD_USER, ENV.USER_PASSWORD);

      AllureHelper.step('Add multiple products to cart');
      await ProductScreen.viewProductsInListView();
      await ProductScreen.addProductsToCart(productsToBuy);

      AllureHelper.step('Place an order');
      await CheckoutScreen.completeCheckout(checkoutUser, productsToBuy.length);

      AllureHelper.step('Verify menu options and logout');
      await MenuScreen.validateMenuItems();
      await MenuScreen.logout();
    });
  });
}
