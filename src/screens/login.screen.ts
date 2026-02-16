import { TIMEOUTS } from "../constants/timeouts";
import { ElementHelpers, enforceOrientation, fillField } from "../utils/helpers";

class LoginScreen {
  get usernameInput() {
    return $("~test-Username");
  }
  get passwordInput() {
    return $("~test-Password");
  }
  get loginButton() {
    return $("~test-LOGIN");
  }
  get lockedOutMessage() {
    return $("~Sorry, this user has been locked out.");
  }
  get invalidCredMessage() {
    return $("~Username and password do not match any user in this service.");
  }

  async login(username: string, password: string) {
    await this.enterUserName(username);
    await this.enterPassword(password);
    await ElementHelpers.clickWithScroll(this.loginButton);
    await enforceOrientation();
  }

  async enterUserName(username: string) {
    await this.usernameInput.waitForDisplayed({
      timeout: TIMEOUTS.long,
      timeoutMsg: "Username input not displayed",
    });
    await fillField(this.usernameInput, username);
  }

  async enterPassword(password: string) {
    await fillField(this.passwordInput, password);
  }
}

export default new LoginScreen();
