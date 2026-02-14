
import { CheckoutUser } from "../models/checkoutUser";
import { ElementHelpers, enforceOrientation } from "../utils/helpers";
import loginScreen from "./login.screen";

class CheckoutScreen {
    cartIcon(count: number) {
        return $(`(//XCUIElementTypeOther[@name="${count}"])[4]`);
    }
    get checkoutButton() {return $('~test-CHECKOUT')}
    get firstName() { return $('~test-First Name')}
    get lastName() {return $('~test-Last Name')}
    get zipCode() {return $('~test-Zip/Postal Code')}
    get continueButton() {return $('~test-CONTINUE')}
    get finishButton() {return $('~test-FINISH')}
    get thankYouMessage() {return $('~THANK YOU FOR YOU ORDER')}
    get dispatchedMessage() {return $('~Your order has been dispatched, and will arrive just as fast as the pony can get there!')}
    get backToHomeButton() {return $('~test-BACK HOME')}
  
    async openCart(length: number) {
        await this.cartIcon(length).waitForExist({ timeout: 5000 });
        await this.cartIcon(length).click();
    }

    async proceedToCheckout() {
        await ElementHelpers.scrollIfNeeded(this.checkoutButton);
        await this.checkoutButton.waitForDisplayed({ timeout: 5000 });
        await this.checkoutButton.click();
    }

    async fillCheckoutDetails(firstName: string, lastName: string, zipCode: string) {
        await this.firstName.waitForExist({ timeout: 5000 });
        await this.firstName.setValue(firstName)
        await loginScreen.returnButton.click();

        await this.lastName.waitForExist({ timeout: 5000 });
        await this.lastName.setValue(lastName);
        await loginScreen.returnButton.click();

        await this.zipCode.waitForExist({ timeout: 5000 });
        await this.zipCode.setValue(zipCode);

    }

    async placeOrder() {
        await loginScreen.returnButton.click();
        await ElementHelpers.scrollIfNeeded(this.continueButton);
        await this.continueButton.waitForExist({ timeout: 5000 });
        await this.continueButton.click();

        await enforceOrientation();
        await ElementHelpers.scrollIfNeeded(this.finishButton);
        await this.finishButton.waitForExist({ timeout: 5000 });
        await this.finishButton.click();
    }

    async verifyOrderSuccess() {
        await this.thankYouMessage.waitForExist({ timeout: 5000 });
        await this.dispatchedMessage.waitForExist({ timeout: 5000 });
    }

    async completeCheckout(user: CheckoutUser, productCount: number) {
        await this.openCart(productCount);
        await this.proceedToCheckout();
        await this.fillCheckoutDetails(user.firstName, user.lastName, user.zip);
        await this.placeOrder();
        await this.verifyOrderSuccess();
        await this.moveBackToHomeScreen();
    }

    async moveBackToHomeScreen(){
        await ElementHelpers.scrollIfNeeded(this.backToHomeButton);
        await this.backToHomeButton.click();
    }

  }
  
  export default new CheckoutScreen()
  