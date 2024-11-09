import { Router } from "express";
import mongoose from "mongoose";

// para cambiar de persistencia, comentar/descomentar uno de estos 2 imports: filesystem para el guardado en archivos JSON o db para usar MongoDB

// import CartManager from "../services/filesystem/CartManager.js";
import CartManager from "../services/db/cart.services.js";

const router = Router();
const cartManager = new CartManager();

// devuelve todos los productos con populate
router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    if (cart) {
      // console.log(JSON.stringify(cart, null, "\t"));
      res.json(cart);
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

// actualiza el carrito con un array de productos
router.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const updatedCart = await cartManager.updateCart(cartId, req.body);
    if (updatedCart) {
      console.log(updatedCart);
      res.json(updatedCart);
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

// elimina todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const updatedCart = await cartManager.deleteAllProducts(cartId);
    res.json({
      status: "success",
      message: "All products deleted from selected cart",
      newdata: updatedCart,
    });
  } catch (error) {
    console.error("Error deleting all products from cart: ", error);
    res.status(404).json({
      status: "error",
      message: error.message,
    });
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

// agrega un producto a cualquier carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    // console.log(`CID: ${cartId}, PID: ${productId}`);
    const updateCart = await cartManager.addProductToCart(cartId, productId);

    res.status(200).json({ message: "Product added to cart" });
    return updateCart;
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// elimina del carrito el producto seleccionado
router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const updatedCart = await cartManager.deleteProductFromCart(
      cartId,
      productId
    );
    res.json({
      status: "success",
      message: "Product deleted from cart",
      newdata: updatedCart,
    });
  } catch (error) {
    console.error("Error deleting a product from cart: ", error);
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
});

// actualizar solo la cantidad de ejemplares del producto
router.put("/:cid/produc/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    //valido que quantity sea positivo para evitar quilombos en la empresa xD
    if (!quantity || quantity <= 0) {
      res.status(400).json({
        status: "error",
        message: "Your number is very wrong",
      });
    }

    const updatedCart = await cartManager.updateQuantity(
      cartId,
      productId,
      quantity
    );

    res.status(200).json({
      status: "success",
      newdata: updatedCart,
    });
  } catch (error) {
    console.error("Error trying to update the quantity of products:", error);
    res.status(500).json({
      status: "error",
      message: "Error trying to update the quantity of products",
      error: error.message,
    });
  }
});

export default router;
