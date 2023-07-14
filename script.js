import {
    Product
} from "./productClass.js";
import {
    getModelFromApi
} from "./common.js";
(async () => {
    const modelFromAPI = await getModelFromApi();
    const products = generateProductsByModel(modelFromAPI);
    renderProducts(products);
    activateEvents();
})();
const generateProductsByModel = (model) => {
    return model['product']?.length ? model['product'].map(el => {
        return new Product(el, model.podzakaz || false, model.dimensions);
    }) : [];
};
const renderProducts = (products) => {
    let result = "";
    products.forEach((product) => {
        console.log("product");
        result += constructProduct(product);
    });
    document.getElementById('productContainer').innerHTML = result;
};
const constructProduct = (product) => {
    const price = product.selectedSize.price;
    return `<div class="product" data-id="${product.id}" >
      <img src="product1.jpg" alt="Product 1" onerror="this.src='https://placehold.co/600x400'">
      <div class="details">
        <h2>${product.name}</h2>        
        <p>Price: ${price.actualPrice} ${price.sale ? `<span style='text-decoration: line-through'>${price.price}</span><span class=\"sale-icon\">SALE</span>` : ""} ${price.currency}</p>        
        <p>${product.maxCount > 0 ? `Only:${product.maxCount} left` : 'Order as much as you want'}</p>        
      </div>
      <div class="controls"> 
          <input type='button' id="btn${product.id}"  class="btn" value="BUY NOW"/>
      </div>
    </div>`;
};
const activateEvents = () => {
    document.querySelectorAll(".product").forEach(function(productElement) {
        productElement.querySelector('#btn' + productElement.dataset.id).addEventListener("click", (el) => {
            document.location.href = '/product.html?id=' + productElement.dataset.id;
        });
    });
};
