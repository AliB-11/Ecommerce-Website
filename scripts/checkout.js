import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary, renderNewQuantity } from "./checkout/paymentSummary.js" ;
import { loadProducts, loadProductsFetch } from "../data/products.js";
//import '../data/cart-class.js'
//import '../data/backend-practice.js';
import { loadCart, loadCartFetch } from "../data/cart.js";





async function loadPage(){  //async makes a function return a promise (wraps code inside a function in promise)

  try{ //inside try put code which could cause an error aka calling backend 

    await Promise.all([
      loadProductsFetch(), 
      loadCartFetch()
    ]);

  } catch(error){
    console.log('unexpected error, please try again later')
  }

  renderOrderSummary();
  renderPaymentSummary();
  renderNewQuantity();

}

loadPage();





/*
Promise.all([

 loadProductsFetch(), //returns a promise

  new Promise((resolve)=>{  //calls a new promise 
    loadCart(()=> {  //runs loadcart and will not continue with code in (then) until resolve is called 
      resolve();
    });
  
  })
  

]).then((values)=>{

  console.log(values);
  renderOrderSummary();
  renderPaymentSummary();
  renderNewQuantity();

});

*/

/*

new Promise ((resolve) => {  //works similar to done

  loadProducts(() => {
    resolve('value1');  //will wait for loadProducts to finish until resolve is called. recall resolve is called within loadproducts function once event listner is activated and data is fethced form the backend 

  });  




}).then((value) =>{  //only runs once resolve function is called aka when loadproducts has been finished 
  console.log(value);

  return new Promise((resolve)=>{  //calls a new promise 
    loadCart(()=> {  //runs loadcart and will not continue with code in (then) until resolve is called 
      resolve();
    });
  
  });




}).then(()=>{
  renderOrderSummary();
  renderPaymentSummary();
  renderNewQuantity();
})


*/


/*
//call backs
loadProducts(()=> {
  loadCart(() => {
  renderOrderSummary();
  renderPaymentSummary(); 
  renderNewQuantity();
  })
}) 

*/



  




