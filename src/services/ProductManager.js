import fs from "fs/promises";
import path from "path";

const productsFilePath = path.resolve("data", "products.json");

export default class ProductManager {
  constructor() {
    this.products = [];
    this.init();
  }

  async init() {
    try {
      const data = await fs.readFile(productsFilePath, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  saveToFile() {
    fs.writeFile(productsFilePath, JSON.stringify(this.products, null, 2));
  }

  getAllProducts(limit) {
    if (limit) {
      return this.products.slice(0, limit);
    }
    return this.products;
  }

  getProductById(pid) {
    return this.products.find((p) => p.id === pid);
  }

  addProduct(product) {
    const newProduct = {
      id: this.products.length
        ? this.products[this.products.length - 1].id + 1
        : 1,
      ...product,
      status: true,
    };
    this.products.push(newProduct);
    this.saveToFile();
    return newProduct;
  }

  updateProduct(pid, updatedFields) {
    const productIndex = this.products.findIndex((p) => p.id === pid);
    if (productIndex === -1) return null;
    const updatedProduct = {
      ...this.products[productIndex],
      ...updatedFields,
      id: this.products[productIndex].id,
    };
    this.products[productIndex] = updatedProduct;
    this.saveToFile();
    return updatedProduct;
  }

  deleteProduct(pid) {
    const productIndex = this.products.findIndex((p) => p.id === pid);
    if (productIndex === -1) return null;
    const deletedProduct = this.products.splice(productIndex, 1);
    this.saveToFile();
    return deletedProduct[0];
  }
}
