
import {cart} from '../data/cart-class.js'
import { products, loadProducts } from '../data/products.js';


//this is a callback
loadProducts(renderProductsGrid);

export function renderProductsGrid() {

  updateCartQuantity();

  //loop through array to create the HTML 
  generateHTML(products);

  checkURL();
  
  searchbarClick(generateURL);

  checkURL();

}

export function checkKeyWords(productDetails, searchLowerCase) {
  let bool;
  let keywords = productDetails.keywords;

  keywords.forEach((keyword) => {
    if ((keyword.toLowerCase()) === searchLowerCase){
      bool = true;
    } 
  })

  if (bool === true){
    return true 
  } else {
    return false
  }

}

export function checkURL() {
  const url = new URL(window.location.href); 

 if (url.searchParams.get('search')) {
  const searchId = url.searchParams.get('search'); 
  const searchLowerCase = searchId.toLowerCase();

  const result = 
  products.filter(productDetails =>
    ((productDetails.name).toLowerCase()).includes(searchLowerCase) || checkKeyWords(productDetails, searchLowerCase))

  

  if(result.length === 0){
    document.querySelector('.js-products-grid').innerHTML = 

    `<div class="no-search-container"> 
       No products found from your search 
    </div>`;

    return;

  } else { 
    generateHTML(result);
    return result;
  }
 
 }

  return;
}





export function generateHTML(array) {
  let productsHtml = ``;

    array.forEach((product) => {
    productsHtml += 
  
        `<div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="${product.getStarsUrl()}">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="js-clothing-sizes" data-product-id="">
            ${product.extraInfoHTML(product.id)}
          </div>
        

          <div class="added-to-cart js-added-${product.id}-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id ="${product.id}">
            Add to Cart
          </button>
        </div>`;

        if(document.querySelector('.js-products-grid')){
          document.querySelector('.js-products-grid').innerHTML = productsHtml;
        } 
      });


      if (document.querySelector('.sizeButtons')) 
        {

          document.querySelectorAll('.js-invisible').forEach((button)=> {
          
            const productId = button.dataset.productId;

            const array = ['js-medium', 'js-small', 'js-large'];

          for(let i = 0; i < 3; i++){
            let button = document.querySelector(`.${array[i]}-${productId}`)

            button.addEventListener('click', ()=> {
            for(let i = 0; i < 3; i++){
              document.querySelector(`.${array[i]}-${productId}`).classList.remove('is-selected')
            }
            button.classList.add('is-selected')

          })
        }  
          })
        }

        document.querySelectorAll('.js-add-to-cart').forEach((buttonElement) => {
          
          let addedMessageTimeoutId;
          
          buttonElement.addEventListener('click', () => {
          //name of product clicked on the page
            const productId = buttonElement.dataset.productId

            document.querySelector(`.js-added-${productId}-to-cart`).classList.add('selected');

            let selectorQuantity = 0;
            
            selectorQuantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

            
            cart.addToCart(productId, selectorQuantity);

            updateCartQuantity();
          
        
              setTimeout(() => {

              if (addedMessageTimeoutId) {
                clearTimeout(addedMessageTimeoutId);
              }

              const timeoutId = setTimeout(() => {
                document.querySelector(`.js-added-${productId}-to-cart`).classList.remove('selected'); 
              }, 2000) 

              addedMessageTimeoutId = timeoutId;
            });
            
          
            });
         });

}


export function generateURL() {

  let yourSearch = document.querySelector('.search-bar').value

  

    const searchHTML =

     `<input class="search-bar" type="text" placeholder="Search">
      
     <a class="js-search" href="amazon.html?search=${yourSearch}">
      <button class="search-button">
        <img class="search-icon" src="images/icons/search-icon.png">
      </button>
      </a>`;

      let newlink = document.querySelector('.js-new-search')
      
      newlink.innerHTML = searchHTML;

      //button must be clicked again in order to go to the new link which was generated from the html above 
      document.querySelector('.search-button').click();
}






export function searchbarClick(generateURL) {

  document.querySelector('.search-button').addEventListener('click', () => {
    generateURL();
       
  }); 

  document.body.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      generateURL();
    }

  })
}



 //changes web page so dont use module here
 function updateCartQuantity() {

  let cartQuantity = cart.calculateCartQuantity();

  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;

}