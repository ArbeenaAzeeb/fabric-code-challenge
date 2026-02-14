import { ElementHelpers, enforceOrientation } from "../utils/helpers";
import loginScreen from "./login.screen";

class CheckoutScreen {
    get cartIcon() {
        return (length: number) => $(`(//XCUIElementTypeOther[@name="${length}"])[4]`);
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

    async fillCheckoutDetails(name1: string, name2: string,code: string) {
        await this.firstName.waitForExist({ timeout: 5000 });
        await this.firstName.setValue(name1)

        await this.lastName.waitForExist({ timeout: 5000 });
        await this.lastName.setValue(name2);

        await this.zipCode.waitForExist({ timeout: 5000 });
        await this.zipCode.setValue(code);

    }

    async placeOrder() {
        await loginScreen.returnButton.click();
        await ElementHelpers.scrollIfNeeded(this.continueButton);
        await this.continueButton.waitForExist({ timeout: 5000 });
        await this.continueButton.click();

        await enforceOrientation();
        await ElementHelpers.scrollIfNeeded(this.finishButton);
        await enforceOrientation();
        await this.finishButton.waitForExist({ timeout: 5000 });
        await enforceOrientation();
        await this.finishButton.click();
    }

    async verifyOrderSuccess() {
        await this.thankYouMessage.waitForExist({ timeout: 5000 });
        await this.dispatchedMessage.waitForExist({ timeout: 5000 });
    }

    async completeCheckout(firstName: string, lastName: string, zip: string) {
        await this.proceedToCheckout();
        await this.fillCheckoutDetails(firstName, lastName, zip);
        await this.placeOrder();
    }

    async moveBackToHomeScreen(){
        await this.backToHomeButton.click();
    }

  }
  
  export default new CheckoutScreen()
  