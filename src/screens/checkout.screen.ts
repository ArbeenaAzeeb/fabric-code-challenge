import { Product } from "../constants/products";
import { CheckoutUser } from "../models/checkoutUser";
import { ElementHelpers, enforceOrientation, fillField } from "../utils/helpers";

class CheckoutScreen {
  cartIcon(count: number) {
    return $(`(//XCUIElementTypeOther[@name="${count}"])[4]`);
  }
  get checkoutButton() {
    return $("~test-CHECKOUT");
  }
  get firstName() {
    return $("~test-First Name");
  }
  get lastName() {
    return $("~test-Last Name");
  }
  get zipCode() {
    return $("~test-Zip/Postal Code");
  }
  get continueButton() {
    return $("~test-CONTINUE");
  }
  get finishButton() {
    return $("~test-FINISH");
  }
  get thankYouMessage() {
    return $("~THANK YOU FOR YOU ORDER");
  }
  get dispatchedMessage() {
    return $(
      "~Your order has been dispatched, and will arrive just as fast as the pony can get there!"
    );
  }
  get backToHomeButton() {
    return $("~test-BACK HOME");
  }

  async openCart(length: number) {
    await this.cartIcon(length).waitForExist();
    await this.cartIcon(length).click();
  }

  async proceedToCheckout() {
    await ElementHelpers.clickWithScroll(this.checkoutButton);
  }

  async fillCheckoutDetails(
    firstName: string,
    lastName: string,
    zipCode: string
  ) {
    await fillField(this.firstName, firstName);
    await fillField(this.lastName, lastName);
    await fillField(this.zipCode, zipCode);
  }

  async placeOrder() {
    await enforceOrientation();
    await ElementHelpers.clickWithScroll(this.continueButton);

    await enforceOrientation();
    await ElementHelpers.clickWithScroll(this.finishButton);
  }

  async verifyOrderSuccess() {
    await this.thankYouMessage.waitForExist();
    await this.dispatchedMessage.waitForExist();
  }

  async completeCheckout(user: CheckoutUser, productCount: number) {
    await this.openCart(productCount);
    await this.proceedToCheckout();
    await this.fillCheckoutDetails(user.firstName, user.lastName, user.zip);
    await this.placeOrder();
    await this.verifyOrderSuccess();
    await this.moveBackToHomeScreen();
  }

  async moveBackToHomeScreen() {
    await ElementHelpers.clickWithScroll(this.backToHomeButton);
  }
}

export default new CheckoutScreen();
