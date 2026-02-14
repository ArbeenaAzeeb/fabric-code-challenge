import { ElementHelpers } from "../utils/helpers";

export class HomeScreen {
  get title() {
    return $("~test-PRODUCTS");
  }
  get firstProduct() {
    return $("(//XCUIElementTypeCell)[1]");
  }
  get addToCartButton() {
    return $("~test-ADD TO CART");
  }
  get backToProducts() {
    return $("~test-BACK TO PRODUCTS");
  }
  productByName(itemLabel: string) {
    return $(
      `//XCUIElementTypeStaticText[@name="test-Item title" and @label="${itemLabel}"]`
    );
  }

  async selectProductByName(itemLabel: string) {
    const product = this.productByName(itemLabel);
    await ElementHelpers.scrollIfNeeded(product);
    await product.click();
  }

  async addSelectedProductToCart() {
    await ElementHelpers.scrollIfNeeded(this.addToCartButton);
    await this.addToCartButton.click();
  }

  async addProductToCart(item: string) {
    await this.selectProductByName(item);
    await this.addSelectedProductToCart();
    await this.backToProducts.click();

    await expect(this.title).toBeDisplayed();
  }

  async addProductsToCart(items: string[]) {
    for (const item of items) {
      await this.addProductToCart(item);
    }
  }
}
export default new HomeScreen();
