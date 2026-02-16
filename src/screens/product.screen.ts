import { Product } from "../constants/products";
import { TIMEOUTS } from "../constants/timeouts";
import { ElementHelpers } from "../utils/helpers";

export class ProductScreen {
  get title() {
    return $("~test-PRODUCTS");
  }
  get addToCartButton() {
    return $("~test-ADD TO CART");
  }
  get productPrice() {
    return $("~test-Price");
  }
  get backToProducts() {
    return $("~test-BACK TO PRODUCTS");
  }
  get toggleView() {
    return $("~test-Toggle");
  }
  productByName(itemLabel: string) {
    return $(
      `//XCUIElementTypeStaticText[@name="test-Item title" and @label="${itemLabel}"]`
    );
  }

  async selectProductByName(itemLabel: string) {
    const product = this.productByName(itemLabel);
    await ElementHelpers.clickWithScroll(product);
  }

  async addSelectedProductToCart() {
    await ElementHelpers.clickWithScroll(this.addToCartButton);
  }

  async checkProductRate(expectedPrice: number) {
    await this.productPrice.waitForDisplayed({ timeout: TIMEOUTS.medium });
    const priceText = await this.productPrice.getText();
    const actualPrice = Number(priceText.replace("$", ""));
    expect(actualPrice).toBe(expectedPrice);
  }

  async returnToProducts() {
    await ElementHelpers.clickWithScroll(this.backToProducts);
    await expect(this.title).toBeDisplayed();
  }

  async addProductToCart(item: Product) {
    await this.selectProductByName(item.name);
    await this.addSelectedProductToCart();
    await this.checkProductRate(item.price);
    await this.returnToProducts();
  }

  async addProductsToCart(items: Product[]) {
    for (const item of items) {
      await this.addProductToCart(item);
    }
  }

  async viewProductsInListView() {
    await this.toggleView.click();
  }
}
export default new ProductScreen();
