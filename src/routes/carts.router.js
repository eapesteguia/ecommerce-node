import { Router } from "express";
import CartManager from "../services/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cartId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { products } = req.body;
    if (!products) {
      return res.status(400).json({ error: "Invalid cart" });
    }
    const cart = await cartManager.addCart({ products });
    res.status(201).json(products);
  } catch (error) {
    console.log(error);
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  // console.log(`CID: ${cartId}, PID: ${productId}`);
  // console.log("CarID tipo:", typeof cartId, "ProductID tipo:", typeof productId);
  try {
    const updateCart = cartManager.addProductToCart(cartId, productId);
    return res.status(200).json({ message: "Product added to cart" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
