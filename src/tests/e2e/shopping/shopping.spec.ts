import Creds from '../../../constants/credentials';
import Items from '../../../constants/products';
import CheckoutScreen from '../../../screens/checkout.screen';
import LoginScreen from '../../../screens/login.screen';
import HomeScreen from '../../../screens/home.screen';
import MenuScreen from '../../../screens/menu.screen';
import { ORIENTATIONS } from '../../../constants/orientation';
import { enforceOrientation } from '../../../utils/helpers';
import { testContext } from '../../../context/testContext';
import { AllureHelper } from '../../../utils/allurehelper';

for (const orientation of ORIENTATIONS) {
    describe.skip(`Shopping Flow in ${orientation}`, () => {
        before(async () => {
            testContext.orientation = orientation;
            await enforceOrientation();
     });

        it('should select multiple products and add to cart', async () => {
            const products = [Items.backpack, Items.bikeLight];
            const checkoutInfo = { firstName: "Jane", lastName: "Doe", zip: "123456" };

            AllureHelper.step('Login with valid credentials');
            await LoginScreen.login(Creds.validUser, Creds.password);

            AllureHelper.step('Add multiple products to cart');
            for (const product of products) {
                await HomeScreen.addProductToCart(product);
            }
            
            AllureHelper.step('Place an order');
            await CheckoutScreen.openCart(products.length);
            await CheckoutScreen.completeCheckout(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.zip);
            await CheckoutScreen.verifyOrderSuccess();
        
            AllureHelper.step('Verify menu options and logout');
            await CheckoutScreen.moveBackToHomeScreen();
            if (orientation == 'PORTRAIT'){
                await MenuScreen.validateMenuItems();
                await MenuScreen.logout();
            }
        });
    });
}
