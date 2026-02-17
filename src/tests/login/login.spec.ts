import LoginScreen from '../../screens/login.screen';
import ProductScreen from '../../screens/product.screen';
import ORIENTATIONS from '../../constants/orientation';
import MenuScreen from '../../screens/menu.screen';
import { enforceOrientation } from '../../utils/helpers';
import { testContext } from '../../context/testContext';
import AllureHelper from '../../utils/allurehelper';
import { ENV } from '../../config/env';

for (const orientation of ORIENTATIONS) {
  describe(`Login Flow in ${orientation}`, () => {
    before(async () => {
      testContext.orientation = orientation;
      await enforceOrientation();
    });

    it('should show error for locked out user credentials', async () => {
      AllureHelper.step('Login with locked out credentials');
      await LoginScreen.login(ENV.LOCKED_USER, ENV.USER_PASSWORD);

      AllureHelper.step('Verify error message for locked user');
      await LoginScreen.verifyLockedOutError();
    });

    it('should login with valid credentials', async () => {
      AllureHelper.step('Login with valid credentials');
      await LoginScreen.login(ENV.STANDARD_USER, ENV.USER_PASSWORD);

      AllureHelper.step('Ensure successful login');
      await ProductScreen.verifyProductsPage();

      AllureHelper.step('User logout');
      await MenuScreen.logout();
    });
  });
}
