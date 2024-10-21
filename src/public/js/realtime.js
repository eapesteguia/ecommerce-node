const socket = io();

// actualizo la lista de productos y los muestro
socket.on("updateProducts", (products) => {
  const productsList = document.getElementById("productsList");
  productsList.innerHTML = "";
  products.forEach((product) => {
    const div = document.createElement("div");
    div.innerHTML = `
     <div class="card item" style="width: 18rem;">
    <img src="${product.thumbnails}" class="card-img-top" alt="${product.title}">
        <div class="card-header">${product.price}</div>
        <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <button type="button" class="btn btn-primary" data-id="${product.id}">Eliminar producto</button>
         </div>
         <div class="card-footer text-body-secondary">
            Stock: ${product.stock} unidades
        </div>
    </div>
      `;
    productsList.appendChild(div);

    // escucho la activación del botón "eliminar producto"
    const deleteButton = div.querySelector("button");
    deleteButton.addEventListener("click", () => {
      const productId = deleteButton.getAttribute("data-id");
      // console.log("Id de producto:", productId);
      if (!productId) {
        console.error("Producto no encontrado");
        return;
      }

      // le pego al endpoint de eliminación de productos
      fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
          }
          // alert("Product removed successfully");
          Swal.fire({
            title: "Product removed successfully",
            icon: "success",
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });
});

// escucho el formulario para crear productos nuevos
const form = document.getElementById("productsForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const product = {};
  data.forEach((value, key) => (product[key] = value));
  console.log("Producto creado:", product);

  // le pego al endpoint de creación de productos
  fetch("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => {
      if (result.status === 201) {
        result.json();
        Swal.fire({
          icon: "success",
          title: "Product created successfully",
        });
        // reseteo los campos del form para no refrescar la ventana
        form.reset();
        // window.location.replace("/realtimeproducts");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error or invalid product, all fields are required",
        });
      }
    })
    .then((json) => console.log(json));
});
