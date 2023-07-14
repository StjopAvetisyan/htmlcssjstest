import {
    getModelFromApi
} from "./common.js";
import {
    Product
} from "./productClass.js";
document.addEventListener("DOMContentLoaded", async function(event) {
    const getIdFromPage = () => {
        let url = document.location.href,
            params = url.split('?')[1].split('&'),
            data = {},
            tmp;
        for (let i = 0, l = params.length; i < l; i++) {
            tmp = params[i].split('=');
            data[tmp[0]] = tmp[1];
        }
        return data.id;
    };
    const getCurrentProductData = (id, dataFromApi = []) => {
        const current = dataFromApi['product'].find(el => el._id === id);
        return new Product(current, dataFromApi.podzakaz, dataFromApi.dimensions);
    };
    const renderProduct = () => {
        const image = constructImage();
        const details = constructDetails();
        const controls = constructControls();
        const el = document.createElement('div');
        document.getElementById('container').innerHTML = el.innerHTML;
        document.getElementById('container').appendChild(image).appendChild(details).appendChild(controls);
    };
    const constructImage = () => {
        let el = document.createElement('div');
        el.innerHTML = `<div class="product">
            <img alt="Product 1"
           onerror="this.src='https://placehold.co/600x400'"
           src="${this.product.images[0] || ''}">
     
    </div>`;
        return el;
    };
    const constructDetails = () => {
        const price = this.product.selectedSize.price;
        let el = document.createElement('div');
        el.innerHTML = `<div class="details">
        <h2>${this.product.name}</h2>
        <p>Price: ${price.actualPrice} ${price.sale ? `<span style='text-decoration: line-through'>${price.price}</span><span class=\"sale-icon\">SALE</span>` : ""} ${price.currency}</p>        
        <p>${this.product.maxCount > 0 ? `Only:${this.product.maxCount} left` : 'Order as much as you want'}</p>    
      </div>`;
        return el;
    };
    const constructColorSelector = () => {
        let result = '<div class="color-selector"><label for="color-select-1">Color:</label>';
        for (const color of this.product.availableColors) {
            result += `<div class="color-option ${color === this.product.selectedColor ? 'selected' : ''}"> ${color} </div>`;
        }
        result += `</div>`;
        return result;
    };
    const constructSizeSelector = () => {
        let result = '<div id="size-selector"class="size-selector" ><label  for="size-select-1">Size:</label>';
        for (const size of this.product.availableSizes) {
            result += `<div   class="size-option tooltip ${size.id === this.product.selectedSize.id ? 'selected' : ''}"
             data-id="${size.id}">${size.name.split('(')[0]}  <span class="tooltiptext">${size.name}</span></div>`;
        }
        result += `</div>`;
        return result;
    };
    const constructCountSelector = () => {
        if (this.product.maxCount === 0) {
            return `<h3>Sorry size not available</h3>`
        }
        return `<div id='count-selector' class ="count-selector">
   <label for="count-input">Count:<span class="count-value">1</span></label>
  <input id="count-input"
         max="${this.product.maxCount < 0 ? 100 : this.product.maxCount}"
         min=""
         type="range"
         value="1">
  
</div>`;
    };
    const constructControls = () => {
        let el = document.createElement('div');
        el.innerHTML = ` <div class="controls">` + constructColorSelector() + constructSizeSelector() + constructCountSelector() + `<input class="btn"
             type="button"
             value="BUY">
    </div>`;
        return el;
    };
    const activateCounterEvents = () => {
        const countSelector = document.getElementById('count-selector');
        if (countSelector) {
            const countSlider = countSelector.querySelector(".count-selector input[type='range']");
            const countValue = countSelector.querySelector(".count-selector span");
            countSlider.addEventListener('change', (evt) => {
                // Handle count change logic here
                countValue.innerHTML = evt.target.value;
            });
        }
    };
    const activateSizeEvents = () => {
        const sizeSelector = document.getElementById('size-selector');
        sizeSelector.querySelectorAll('.size-option').forEach(el => {
            el.addEventListener('click', (evt) => {
                document.querySelectorAll('.size-option').forEach(el => {
                    el.classList.remove("selected");
                });
                evt.target.classList.add("selected");
                const id = evt.target.dataset.id;
                this.product = this.product.changeSize(id);
                loadData();
            });
        });
    };
    const activateEvents = () => {
        activateCounterEvents();
        activateSizeEvents();
    };
    const loadData = async () => {
        if (!this.product) {
            const id = getIdFromPage();
            if (!id) alert("Missing parameter");
            const dataFromApi = await getModelFromApi();
            if (dataFromApi) {
                console.log(this.product);
                this.product = getCurrentProductData(id, dataFromApi);
            } else {
                alert("No data from API");
            }
        }
        renderProduct();
        activateEvents();
    };
    await loadData();
});
