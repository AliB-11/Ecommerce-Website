import { cart } from '../../data/cart-class.js'
import { getProduct } from "../../data/products.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js"
import { addOrder } from '../../data/orders.js';


export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingCost = 0;
  cart.cartItems.forEach((cartItem)=>{
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    deliveryOptions.forEach((deliveryOption) => {

      if (deliveryOption.id === cartItem.deliveryOptionId) {
        shippingCost += deliveryOption.priceCents;
      }
    })
  });

  const totalBeforeTaxCents = productPriceCents + shippingCost;
  const totalTaxCents = (totalBeforeTaxCents)*0.1 
  const totalCents = totalTaxCents + totalBeforeTaxCents;

  const paymentSummaryHTML = 
  
    `<div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div class="js-payment-summary-items"> Items: </div>
      <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(shippingCost)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(totalTaxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>`;

    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

    document.querySelector('.js-place-order').addEventListener('click', async ()=> {

      let quantity = renderNewQuantity()

      if (quantity === 0) {
        document.querySelector('.js-place-order').innerHTML = 'Please add items to make an order'
      } else {

      try {
      //we need to send our data (cart) to the backend
      //wait for fetch to get value from backend

        const response = await fetch('https://supersimplebackend.dev/orders', { 
          method: 'POST',
          headers: {  //we are sending json
            'Content-Type' : 'application/json'
            
          }, 
          body: JSON.stringify({
            cart: cart.cartItems
          })
        });

        const order = await response.json() 

        addOrder(order);

      }catch(error) {
        console.log('unexpected error. try again later');
      }



      window.location.href='orders.html'
    }
     
    });

    

}


export function renderNewQuantity() {

  let newQuantity = cart.calculateCartQuantity();
      
  const quantityHTML = 
    `Checkout (<a class="return-to-home-link"
    href="amazon.html"> ${newQuantity} items </a>)
   `;

   document.querySelector('.js-cart-quantity-checkout').innerHTML =  quantityHTML;

   document.querySelector('.js-payment-summary-items').innerHTML =
    `Items (${newQuantity}): `;

    return newQuantity;

    
}