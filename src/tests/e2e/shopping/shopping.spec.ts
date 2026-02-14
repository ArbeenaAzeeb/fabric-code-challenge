import Creds from '../../../constants/credentials';
import Items from '../../../constants/products';
import CheckoutScreen from '../../../screens/checkout.screen';
import LoginScreen from '../../../screens/login.screen';
import HomeScreen from '../../../screens/home.screen';
import MenuScreen from '../../../screens/menu.screen';
import { ORIENTATIONS } from '../../../constants/orientation';
import { enforceOrientation } from '../../../utils/helpers';

for (const orientation of ORIENTATIONS) {
    describe(`Shopping Flow in ${orientation}`, () => {
        before(async () => {
        await enforceOrientation(orientation);
     });

        it('should select multiple products and add to cart', async () => {
            const products = [Items.backpack, Items.bikeLight, Items.jacket];
            const checkoutInfo = { firstName: "Jane", lastName: "Doe", zip: "123456" };

            await LoginScreen.login(Creds.validUser, Creds.password, orientation);

            // Add multiple products to cart
            for (const product of products) {
                await HomeScreen.addProductToCart(product);
            }

            // Place order
            await CheckoutScreen.openCart(products.length);
            await CheckoutScreen.completeCheckout(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.zip, orientation);
            await CheckoutScreen.verifyOrderSuccess();

            // Verify menu options
            await CheckoutScreen.moveBackToHomeScreen();
            await MenuScreen.validateMenuItems(orientation);

            if (orientation == 'PORTRAIT'){
                await MenuScreen.logout();
            }
        });

    });
}
