import Creds from '../../constants/credentials';
import LoginScreen from '../../screens/login.screen'
import HomeScreen from '../../screens/home.screen'
import { ORIENTATIONS } from '../../constants/orientation';
import MenuScreen from '../../screens/menu.screen';
import { enforceOrientation } from '../../utils/helpers';
import { testContext } from '../../context/testContext';
import { AllureHelper } from '../../utils/allurehelper';

for (const orientation of ORIENTATIONS) {
    describe(`Login Flow in ${orientation}`, () => {
    before(async () => {
        testContext.orientation = orientation;
        await enforceOrientation();
    });
    
    it('should show error for locked out user credentials', async () => {
        AllureHelper.step('Login with locked out credentials');
        await LoginScreen.login(Creds.lockedUser, Creds.password);

        AllureHelper.step('Verify error message for locked user');
        const error = await LoginScreen.lockedOutMessage.getText();
        expect(error).toBe('Sorry, this user has been locked out.');
        
    });

     it('should login with valid credentials', async () => {
        AllureHelper.step('Login with valid credentials');
        await LoginScreen.login(Creds.validUser, Creds.password)
        
        AllureHelper.step('Ensure successful login');
        await expect(HomeScreen.title).toBeDisplayed()
        
        if (orientation == 'PORTRAIT'){
            AllureHelper.step('User logout');
            await MenuScreen.logout();
        
        }
        
    })
})
}
