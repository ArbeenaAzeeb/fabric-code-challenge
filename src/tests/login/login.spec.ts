import Creds from '../../constants/credentials';
import LoginScreen from '../../screens/login.screen'
import HomeScreen from '../../screens/home.screen'
import { ORIENTATIONS } from '../../constants/orientation';
import MenuScreen from '../../screens/menu.screen';
import { enforceOrientation } from '../../utils/helpers';

for (const orientation of ORIENTATIONS) {
    describe(`Login Flow in ${orientation}`, () => {
    before(async () => {
        await enforceOrientation(orientation);
    });
    
    it('should show error for locked out user credentials', async () => {
        await LoginScreen.login(Creds.lockedUser, Creds.password, orientation);
        const error = await LoginScreen.lockedOutMessage.getText();
        expect(error).toBe('Sorry, this user has been locked out.');
    });

     it('should login with valid credentials', async () => {
        await LoginScreen.login(Creds.validUser, Creds.password, orientation)
        await expect(HomeScreen.title).toBeDisplayed()
        if (orientation == 'PORTRAIT'){
            await MenuScreen.logout();
        }
        
    })
})
}
