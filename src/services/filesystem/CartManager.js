import fs from "fs/promises";
import path from "path";

const cartsFilePath = path.resolve("data", "carts.json");

export default class CartManager {
  constructor() {
    this.carts = [];
    this.init();
  }

  async init() {
    try {
      const data = await fs.readFile(cartsFilePath, "utf-8");
      this.carts = JSON.parse(data);
    } catch (error) {
      this.carts = [];
    }
  }

  saveToFile() {
    fs.writeFile(cartsFilePath, JSON.stringify(this.carts, null, 2));
  }

  getCartById(cid) {
    return this.carts.find((c) => c.id === parseInt(cid));
  }

  addCart(products) {
    const newCart = {
      id: this.carts.length ? this.carts[this.carts.length - 1].id + 1 : 1,
      ...products,
    };
    this.carts.push(newCart);
    this.saveToFile();
    return newCart;
  }

  addProductToCart(cid, pid) {
    const cart = this.getCartById(cid);
    if (!cart) {
      throw new Error("Cart not found");
    }
    const productIndex = cart.products.findIndex((p) => p.id === parseInt(pid));
    if (productIndex > -1) {
      cart.products[productIndex].quantity += 1;
      this.saveToFile();
    //console.log(`Producto ${pid} incrementado en ${cart.products[productIndex].quantity} cantidades`);
    } else {
      cart.products.push({ id: parseInt(pid), quantity: 1 });
      this.saveToFile();
    }
  }
}
