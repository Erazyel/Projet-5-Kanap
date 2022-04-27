let cart = JSON.parse(localStorage.getItem("cart"));
console.log(cart);
if (cart === null) {
  // si le panier n'existe pas, on crée le panier
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
}

const colorPicked = document.querySelector("#colors");
const quantityPicked = document.querySelector("#quantity");
const btn_envoyerPanier = document.querySelector("#addToCart");

main();

async function main() {
  const str = window.location.href;
  const url = new URL(str);
  const idProduct = url.searchParams.get("id");
  const product = await getProduct(idProduct);
  updatePage(product);
  btn_envoyerPanier.addEventListener("click", () => onAddToCart(product));
}

// Récupération des articles de l'API
async function getProduct(idProduct) {
  const result = await fetch("http://localhost:3000/api/products/" + idProduct);
  const product = await result.json();
  return product;
}

function updatePage(product) {
  // Insertion de l'image
  let productImg = document.createElement("img");
  document.querySelector(".item__img").appendChild(productImg);
  productImg.src = product.imageUrl;
  productImg.alt = product.altTxt;

  // Modification du titre "h1"
  let productName = document.getElementById("title");
  productName.innerHTML = product.name;

  // Modification du prix
  let productPrice = document.getElementById("price");
  productPrice.innerHTML = product.price;

  // Modification de la description
  let productDescription = document.getElementById("description");
  productDescription.innerHTML = product.description;

  // Insertion des options de couleurs
  for (let color of product.colors) {
    // console.table(color);
    let productColor = document.createElement("option");
    productColor.value = color;
    productColor.innerHTML = color;
    document.querySelector("#colors").appendChild(productColor);
  }
}

//Gestion du panier
function onAddToCart(product) {
  const isValidCart = controlCart();
  if (isValidCart) {
    addToCart(product);
  }
}
// Contrôle de la quantité et de la couleur avant ajout
function controlCart() {
  if (quantityPicked.value <= 0 || quantityPicked.value > 100) {
    alert("Quantité invalide, veuillez indiquer une quantité entre 1 et 100");
    return false;
  }
  if (colorPicked.value === "") {
    alert("Veuillez sélectionner une couleur");
    return false;
  }
  return true;
}
// Ajout d'un produit au panier
function addToCart(product) {
  let cartProduct = cart.find(
    (p) => p._id === product._id && p.color === colorPicked.value
  );

  if (cartProduct === undefined) {
    // si le produit n'existe pas, on ajoute le produit au panier
    cartProduct = {
      _id: product._id,
      color: colorPicked.value,
      quantity: Number(quantityPicked.value),
    };
    console.log(cartProduct);
    cart.push(cartProduct);
  } else {
    // si le produit existe déjà on met à jour la quantité
    cartProduct.quantity = cartProduct.quantity + Number(quantityPicked.value);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  //   addProductToCart(product, quantityPicked.value, colorPicked.value);
}