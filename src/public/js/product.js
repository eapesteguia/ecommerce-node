// escucho la activación del botón "Agregar al carrito"
document.addEventListener("DOMContentLoaded", function () {
  const addToCartBtn = document.getElementById("addToCart");
  addToCartBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // const pid = this.dataset._id;
    const pid = addToCartBtn.getAttribute("data-id");

    const cartData = {
      products: [
        {
          productid: pid,
          quantity: 1,
        },
      ],
    };

    fetch("/api/carts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Trying to add a product");
        }
        return response.json();
      })
      .then((result) => {
        return Swal.fire({
          title: "Product added successfully",
          icon: "success",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        return Swal.fire({
          title: "Cant add this product",
          icon: "error",
        });
      });
  });
});
