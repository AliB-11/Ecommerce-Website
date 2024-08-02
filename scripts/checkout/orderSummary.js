import { products, getProduct } from "../../data/products.js";
import  formatCurrency   from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js" //default export (we use it when we only want to export 1 thing from another file)
import { deliveryOptions } from "../../data/deliveryOptions.js";
import { renderPaymentSummary, renderNewQuantity } from './paymentSummary.js';
import { cart } from '../../data/cart-class.js';

export function renderOrderSummary() {
  let cartSummaryHTML = ''; 
  let initialQuantity = 0; 


  cart.cartItems.forEach((cartItem) => {

    const productId = cartItem.productId;
    initialQuantity += cartItem.quantity;
    
    const matchingProduct = getProduct(productId);
   
    cartSummaryHTML +=` 
    <div class="cart-item-container 
    js-cart-item-container-${matchingProduct.id}
    js-cart-item-container">
              <div class="delivery-date">
                Delivery date: ${findDeliveryDate(cartItem)}
              </div>

              <div class="cart-item-details-grid">
                <img class="product-image"
                  src="${matchingProduct.image}">

                <div class="cart-item-details">
                  <div class="product-name">
                    ${matchingProduct.name}
                  </div>

                  <div class="product-price">
                    ${matchingProduct.getPrice()}
                  </div>

                  <div class="product-quantity product-quantity-${matchingProduct.id}">
                    <span>
                      Quantity: <span class="quantity-label quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-quantity"
                    data-product-id = "${matchingProduct.id}">
                      Update
                    </span>
                    <input class="quantity-input quantity-input-${matchingProduct.id}">
                    <span class="save-quantity-link link-primary" data-product-id ="${matchingProduct.id}">Save</span>
                    <span class="js-update-class-${matchingProduct.id}">
                    <span class="delete-quantity-link link-primary js-delete-quantity js-delete-link-${matchingProduct.id}"
                    data-product-id ="${matchingProduct.id}">
                      Delete
                    </span>
                  </div>
                </div>

                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                  ${deliveryOptionsHTML(matchingProduct, cartItem)}
                </div>
              </div>
            </div>`;

  }); 

  


  document.querySelector('.js-cart-quantity-checkout').innerHTML =  `Checkout (<a class="return-to-home-link"
  href="amazon.html"> ${initialQuantity} items</a>)
  `;

  

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;




  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html  = ''
    deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} - `;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    
        html += `<div class="delivery-option js-delivery-option js-delivery-option-${matchingProduct.id}-${deliveryOption.id}"
        data-product-id = "${matchingProduct.id}"
        data-delivery-option-id ="${deliveryOption.id}">
        <input class="js-input-${matchingProduct.id}-${deliveryOption.id}" type="radio" ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}   
          </div>
          <div class="delivery-option-price">
            ${priceString} shipping
          </div>
        </div>
      </div>`;

    })
    return html;

  }

  function findDeliveryDate(cartItem) {
    let deliveryDate;
    deliveryOptions.forEach( (deliveryOption)=>{
        if (deliveryOption.id === cartItem.deliveryOptionId){
          const today = dayjs();
          deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
          deliveryDate = deliveryDate.format('dddd, MMMM D'); 
        }    
    });
    return deliveryDate;
    
  }

  

  document.querySelectorAll('.js-delete-quantity').forEach((link) => {
    
    link.addEventListener('click', () => {
      const productId = link.dataset.productId; 
      console.log(productId);

      cart.removeFromCart(productId);

      renderOrderSummary();

      renderPaymentSummary();

      renderNewQuantity();
    });

  }); 

  document.querySelectorAll(`.js-update-quantity`).forEach((updateButton)=> {
    updateButton.addEventListener('click', ()=> {
      const productId = updateButton.dataset.productId;
      console.log(productId);

      const container = document.querySelector(`.product-quantity-${productId}`);

      container.classList.add('is-editing-quantity');
    
      renderNewQuantity();

      
      
    });
  });

  document.querySelectorAll('.save-quantity-link').forEach((link)=> {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      const container = document.querySelector(`.product-quantity-${productId}`);

      container.classList.remove('is-editing-quantity');

      let amount = Number(document.querySelector(`.quantity-input-${productId}`).value);

      cart.updateQuantity(productId, amount);

      cart.calculateCartQuantity();
      
      renderOrderSummary();
      renderPaymentSummary();
      renderNewQuantity();


    })

  }); 

  document.querySelectorAll('.js-delivery-option').forEach((element)=> {
    element.addEventListener('click', ()=> {
      const { productId, deliveryOptionId} = element.dataset
      cart.updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
      renderNewQuantity();
    })

  });


}








