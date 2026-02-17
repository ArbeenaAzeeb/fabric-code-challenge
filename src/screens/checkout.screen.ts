import { CheckoutUser } from '../models/checkoutUser';
import { ElementHelpers, enforceOrientation, fillField } from '../utils/helpers';

class CheckoutScreen {
  cartIcon(count: number) {
    return $(`(//XCUIElementTypeOther[@name="${count}"])[4]`);
  }
  get checkoutButton() {
    return $('~test-CHECKOUT');
  }
  get firstName() {
    return $('~test-First Name');
  }
  get lastName() {
    return $('~test-Last Name');
  }
  get zipCode() {
    return $('~test-Zip/Postal Code');
  }
  get continueButton() {
    return $('~test-CONTINUE');
  }
  get finishButton() {
    return $('~test-FINISH');
  }
  get thankYouMessage() {
    return $('~THANK YOU FOR YOU ORDER');
  }
  get dispatchedMessage() {
    return $(
      '~Your order has been dispatched, and will arrive just as fast as the pony can get there!',
    );
  }
  get backToHomeButton() {
    return $('~test-BACK HOME');
  }

  async openCart(length: number) {
    await this.cartIcon(length).waitForExist();
    await this.cartIcon(length).click();
  }

  async proceedToCheckout() {
    await ElementHelpers.clickWithScroll(this.checkoutButton);
  }

  async fillCheckoutDetails(user: CheckoutUser) {
    await fillField(this.firstName, user.firstName);
    await fillField(this.lastName, user.lastName);
    await fillField(this.zipCode, user.zip);
  }

  async placeOrder() {
    await enforceOrientation();
    await ElementHelpers.clickWithScroll(this.continueButton);

    await enforceOrientation();
    await ElementHelpers.clickWithScroll(this.finishButton);
  }

  async verifyOrderSuccess() {
    await expect(this.thankYouMessage).toBeDisplayed();
    await expect(this.thankYouMessage).toHaveText('THANK YOU FOR YOU ORDER');

    await expect(this.dispatchedMessage).toBeDisplayed();
    await expect(this.dispatchedMessage).toHaveText(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
    );
  }

  async completeCheckout(user: CheckoutUser, productCount: number) {
    await this.openCart(productCount);
    await this.proceedToCheckout();
    await this.fillCheckoutDetails(user);
    await this.placeOrder();
    await this.verifyOrderSuccess();
    await this.moveBackToHomeScreen();
  }

  async moveBackToHomeScreen() {
    await ElementHelpers.clickWithScroll(this.backToHomeButton);
  }
}

export default new CheckoutScreen();
