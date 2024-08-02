//create the orders page 

import {  orders, saveToStorage} from '../data/orders.js'
import {formatCurrency } from '../scripts/utils/money.js'
import { getProduct } from '../data/products.js';

import { loadProductsFetch } from '../data/products.js';

import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js" 




export async function productsload (fun) {

  await loadProductsFetch(); 


  fun();


}




function renderOrderedProducts(order) {
 
  let productsHTML = '';
  


    order.products.forEach((orderedProduct) => {
      
      

      const matchingProduct = getProduct(orderedProduct.productId);



     

      productsHTML += 
      
      `<div class="product-image-container">
              <img src=${matchingProduct.image}>
            </div>

            <div class="product-details">
              <div class="product-name">
                ${matchingProduct.name}
              </div>
              <div class="product-delivery-date">
                Arriving on: ${dayjs(orderedProduct.estimatedDeliveryTime).format('MMMM D')}
              </div>
              <div class="product-quantity">
                Quantity: ${orderedProduct.quantity}
              </div>
              <button class="buy-again-button button-primary js-buy-again"
              data-product-id = ${orderedProduct.productId}
              data-order-id = ${order.id}
              >
                <img class="buy-again-icon js-image-${orderedProduct.productId}-${order.id}" src="images/icons/buy-again.png">
                <span class="buy-again-message js-added-${orderedProduct.productId}-${order.id}">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html?orderId=${order.id}&productId=${orderedProduct.productId}">
                <button class="track-package-button button-secondary">
                  Track package
                </button>
              </a>
            </div>`;
      
  }); 
  return productsHTML;

}



function renderOrders() {
  let orderHTML = '';

  saveToStorage();
  
  orders.forEach((order) => {

    

    orderHTML += 
    ` <div class="order-container">
          
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${dayjs(order.orderTime).format('MMMM D')}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(order.totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>

          <div class="order-details-grid">
           ${renderOrderedProducts(order)}
          </div>
        </div>`;



  })

    const grid = document.querySelector('.js-order-grid')

    if (grid) {
      grid.innerHTML  = orderHTML;
    }
    
   
  document.querySelector('.js-cart-link').addEventListener('click', () => {
    localStorage.clear('cart-oop');
    saveToStorage();
  
  })

  document.querySelector('.js-amazon-link').addEventListener('click', ()=> {
    localStorage.clear('cart-oop');
    saveToStorage();
  });

 




  document.querySelectorAll('.js-buy-again').forEach( (buttonElement)=> {
    buttonElement.addEventListener('click', ()=> {
      const productId = buttonElement.dataset.productId;
      const orderId = buttonElement.dataset.orderId;

      updateOrderAndCart(productId, orderId);

      renderOrders();


      document.querySelector(`.js-added-${productId}-${orderId}`).innerHTML = 'Added &#x2713'

      document.querySelector(`.js-image-${productId}-${orderId}`).classList.add('added-to-order');

      setTimeout(()=> {

         document.querySelector(`.js-added-${productId}-${orderId}`).innerHTML = 'Buy it again'

         document.querySelector(`.js-image-${productId}-${orderId}`).classList.remove('added-to-order');

      }, 2000)


    });

  });


  searchProducts();
  

}

function updateOrderAndCart(productId,orderId){

//add extra item to order 

orders.forEach((order)=> {
  if (order.id === orderId) {
    order.products.forEach((item)=>{
      if (item.productId === productId){
        const matching = getProduct(item.productId); 
        order.totalCostCents += matching.priceCents;
        item.quantity += 1;
      }
    })
  }

});

saveToStorage();

 
}

export function searchProducts() {

  document.querySelector('.js-search-button').addEventListener('click', () => {

    let yourSearch = document.querySelector('.js-search-bar').value

    window.location.href = `amazon.html?search=${yourSearch}`;

  }); 

  document.body.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {

      let yourSearch = document.querySelector('.js-search-bar').value

      
      window.location.href = `amazon.html?search=${yourSearch}`;
    }
  })

}

productsload(renderOrders); 

  




