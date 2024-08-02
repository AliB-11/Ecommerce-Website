export let cart;

loadFromStorage();

export function loadFromStorage(){ 
  cart = JSON.parse(localStorage.getItem('cart'));

if (!cart){
  cart = [{
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
    deliveryOptionId: '1'
  }, 
    {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1,
    deliveryOptionId:'2'
    } ];
}


}




function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, selectorQuantity) {
      
  let checker;
  for (let i = 0; i < cart.length; i++){
    let product = cart[i];
    if (product.productId !== productId) {
      checker = false;
    } else {
      checker = true;
      product.quantity += selectorQuantity;
      break
    }
  }

  if (checker === false  || cart.length === 0) {
    cart.push({
      productId, 
      quantity: selectorQuantity, 
      deliveryOptionId: '1'
    })    
  }

  saveToStorage();

}



export function removeFromCart(productId) {
  const newCart = [];
  cart.forEach( (cartItem) => {
    if (cartItem.productId !== productId){
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  saveToStorage();
}

export function calculateCartQuantity() {
  let cartAmount = 0;
  cart.forEach((cartItem) => {
  cartAmount += cartItem.quantity;
  })
  return cartAmount;
}

export function updateQuantity(productId, amount){

  cart.forEach((cartItem)=> {
    if (productId === cartItem.productId) {
      cartItem.quantity = amount; 
    }
  })

  document.querySelector(`.quantity-label-${productId}`).innerHTML = amount;

  saveToStorage();

}

export function updateDeliveryOption(productId, deliveryOptionId){
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();

}


export async function loadCartFetch() {
  const response = await fetch('https://supersimplebackend.dev/cart') //fetch returns a promise (so wait for the promise to finish before moving onto code below)
  const text = await response.text();
  console.log(text)
  return text;
}





export function loadCart(fun) {
  const xhr = new XMLHttpRequest();


  xhr.addEventListener('load', () =>{
    console.log(xhr.response);
  fun();

  }); 

  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  
  xhr.send();


}