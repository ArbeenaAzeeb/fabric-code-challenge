import Creds from '../../constants/credentials';
import LoginScreen from '../../screens/login.screen'
import HomeScreen from '../../screens/home.screen'
import { ORIENTATIONS } from '../../constants/orientation';
import MenuScreen from '../../screens/menu.screen';
import { enforceOrientation } from '../../utils/helpers';
import { testContext } from '../../context/testContext';
import { allureStep } from '../../utils/allurehelper';

for (const orientation of ORIENTATIONS) {
    describe(`Login Flow in ${orientation}`, () => {
    before(async () => {
        testContext.orientation = orientation;
        await enforceOrientation();
    });
    
    it('should show error for locked out user credentials', async () => {
        await allureStep('Login with locked credentials', async () => {
            await LoginScreen.login(Creds.lockedUser, Creds.password);
        });
        await allureStep('Verify error message for locked user', async () => {
            const error = await LoginScreen.lockedOutMessage.getText();
            expect(error).toBe('Sorry, this user has been locked out.');
        });
    });

     it('should login with valid credentials', async () => {
        await allureStep('Login with valid credentials', async () => {
            await LoginScreen.login(Creds.validUser, Creds.password)
        });
        await allureStep('Ensure successful login', async () => {
            await expect(HomeScreen.title).toBeDisplayed()
        });
        if (orientation == 'PORTRAIT'){
            await allureStep('User logout', async () => {
                await MenuScreen.logout();
            });
        }
        
    })
})
}
