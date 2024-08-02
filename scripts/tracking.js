 import { getProduct } from "../data/products.js";

 import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js" 


 import { orders, saveToStorage } from "../data/orders.js";

 
import { productsload, searchProducts } from "./orders.js";

 

 function renderTrackingHTML () {

    //window paramter gets url at the top of the browser 
    const url = new URL(window.location.href); 
    //will let us get the url parameter (orderId)
    const orderId = url.searchParams.get('orderId')
    const productId = url.searchParams.get('productId')

  let productOrder = '';
  let customerOrder = '';

    orders.forEach((order)=>{
      if (order.id === orderId){
        customerOrder = order;
        }
      })

   //loop thru the array of products in the order
   
   console.log(customerOrder)

    customerOrder.products.forEach((productOrdered) => {
      if (productOrdered.productId === productId ) {
        productOrder = productOrdered;
      }
    })

   console.log(productOrder);
 
  const matchingProduct = getProduct(productId);
  
  let percent = deliveryTime(productOrder,customerOrder)

  if (percent === 0) {
    percent = 5;
  }



  

  const trackingHTML = `<a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          Arriving on ${dayjs(productOrder.estimatedDeliveryTime).format('dddd, MMMM D')}
        </div>

        <div class="product-info">
          ${matchingProduct.name}
        </div>

        <div class="product-info">
          Quantity: ${productOrder.quantity}
        </div>

        <img class="product-image" src="${matchingProduct.image}">

        <div class="progress-labels-container">
          <div class="progress-label progress-prep">
            Preparing
          </div>
          <div class="progress-label progress-ship">
            Shipped
          </div>
          <div class="progress-label progress-delivered">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar"></div>
        </div>
        
        <style> 
          .progress-bar {
              height: 100%;
              background-color: green;
              border-radius: 50px;
              animation: animate 1.5s linear forwards;
            }

            @keyframes animate{
              0% {
                width: 0;
              } 100% {
                width: ${percent}%;
              }
            }
        
        </style>`;



        const trackingPage = document.querySelector('.order-tracking')

        if (trackingPage) {
          trackingPage.innerHTML = trackingHTML;
        }

        if (percent >= 0 && percent <= 49 ){
          document.querySelector('.progress-prep').classList.add('current-status')
        } else if (percent > 49 && percent < 99){
          document.querySelector('.progress-ship').classList.add('current-status')

        } else {
          document.querySelector('.progress-delivered').classList.add('current-status')
        }

      searchProducts();

        
 }

 function deliveryTime(productOrder, order) {
 
  const deliveryDate = dayjs(productOrder.estimatedDeliveryTime);

  const today = dayjs();

  const orderTime =  dayjs(order.orderTime);

 const difference = deliveryDate.diff(orderTime, 'hours');

 const todaysDifference = today.diff(orderTime, 'hours'); 

 return (todaysDifference/difference)*100;


 }


productsload(renderTrackingHTML);



 

 