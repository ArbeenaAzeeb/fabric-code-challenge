import { ElementHelpers, enforceOrientation } from "../utils/helpers";


export class MenuScreen {
    get menuButton() { return $('~test-Menu'); }
    get logoutButton() { return $('~test-LOGOUT'); }
    get allItemsButton() { return $('~test-ALL ITEMS'); }
    get qrScannerButton() { return $('~test-QR CODE SCANNER'); }
    get geoLocationButton() { return $('~test-GEO LOCATION'); }
    get drawingButton() { return $('~test-DRAWING'); }
    get aboutButton() { return $('~test-ABOUT'); }
    get resetAppStateButton() { return $('~test-RESET APP STATE'); }

    async viewMenu() {
        await this.menuButton.click();
        await enforceOrientation();
    }

    async logout() {
        await this.viewMenu();
        await ElementHelpers.scrollIfNeeded(this.logoutButton);
        await this.logoutButton.click();
    }

    async isMenuItemVisible(item: ChainablePromiseElement) {
        await ElementHelpers.scrollIfNeeded(item);
        return await item.isDisplayed();
    }

    async validateMenuItems() {
        const elementsToCheck = [
            this.logoutButton,
            this.allItemsButton,
            this.qrScannerButton,
            this.geoLocationButton,
            this.drawingButton,
            this.aboutButton,
            this.resetAppStateButton,
        ];

        await this.viewMenu();
        for (const el of elementsToCheck) {
            const visible = await this.isMenuItemVisible(el);
            expect(visible).toBe(true); 
        }
        // Close menu
        await this.viewMenu();
    }
    
}
export default new MenuScreen()
