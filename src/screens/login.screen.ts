import { enforceOrientation } from "../utils/helpers"

class LoginScreen {
    get usernameInput() {return $('~test-Username')}
    get passwordInput() {return $('~test-Password')}
    get loginButton() {return $('~test-LOGIN')}
    get lockedOutMessage() {return $('~Sorry, this user has been locked out.')}
    get invalidCredMessage() {return $('~Username and password do not match any user in this service.')}
  
    async login(username: string, password: string, orientation: string) {
        await this.usernameInput.waitForDisplayed({
          timeout: 10000,
          timeoutMsg: 'Username input not displayed'
        })
      
        await this.usernameInput.clearValue()
        await this.usernameInput.setValue(username)
        await $('~Return').click();

        await this.passwordInput.setValue(password)
        await $('~Return').click();

        await this.loginButton.click()
        await enforceOrientation(orientation);
      }

      
  }
  
  export default new LoginScreen()
  