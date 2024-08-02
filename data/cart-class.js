class Cart{
  //a class is a object generator

  //property in a class 
  cartItems;

  //same as localStorage = undefined;
  //# private property -> can only be used inside the class 
  #localStorageKey;

 //allows u to run set-up code (code in a constructor is ran automatically when the object is initialized) construcutors also have paramters
 //consturctor CANNOT return
  constructor(localStorageKey) {

      this.#localStorageKey = localStorageKey;

      this.#loadFromStorage();
  }

  //method below is shortcut for 
  //loadFromStorage: function() {
  #loadFromStorage () { 
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey));


  //'this' gives us the outer object essientially a replacment for typing out the object varaible name 
  if (!this.cartItems){
    this.cartItems = [];
  }
  
  
  }

  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }


  
  addToCart(productId, selectorQuantity) {
        
    let checker;
    for (let i = 0; i < this.cartItems.length; i++){
      let product = this.cartItems[i];
      if (product.productId !== productId) {
        checker = false;
      } else {
        checker = true;
        product.quantity += selectorQuantity;
        break
      }
    }
  
    if (checker === false  || this.cartItems.length === 0) {
      this.cartItems.push({
        productId, 
        quantity: selectorQuantity, 
        deliveryOptionId: '1'
      })    
    }
  
    this.saveToStorage();
  
  }

  


  removeFromCart(productId) {
    const newCart = [];
    this.cartItems.forEach( (cartItem) => {
      if (cartItem.productId !== productId){
        newCart.push(cartItem);
      }
    });
    this.cartItems = newCart;
    this.saveToStorage();
  } 




  updateDeliveryOption(productId, deliveryOptionId){
    let matchingItem;

    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
  
    matchingItem.deliveryOptionId = deliveryOptionId;
    this.saveToStorage();
  
  } 




    calculateCartQuantity() {
    let cartAmount = 0;
    this.cartItems.forEach((cartItem) => {
    cartAmount += cartItem.quantity;
    })
    return cartAmount;
  } 



  
  updateQuantity(productId, amount){

    this.cartItems.forEach((cartItem)=> {
      if (productId === cartItem.productId) {
        cartItem.quantity = amount; 
      }
    })

    document.querySelector(`.quantity-label-${productId}`).innerHTML = amount;

    this.saveToStorage();

  }

}


//instance of the class
export const cart = new Cart('cart-class');
const businessCart = new Cart('cart-business');

// cart.localStorageKey = 'aaa' -> should not be done 











