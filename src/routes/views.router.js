import express from "express";
import { Router } from "express";
import ProductManager from "../services/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

// Renderizo los productos en plantilla home
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getAllProducts();
    res.render("home", {
      style: "home.css",
      products,
    });
  } catch (error) {
    console.log("Error al obtener productos", error);
  }
});

// Renderizo los productos usando socket en la plantilla realtimeproducts
router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {
    style: "home.css",
  });
});

export default router;
