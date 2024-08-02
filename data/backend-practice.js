const xhr = new XMLHttpRequest(); //creates a new http message
//load means response has loaded
xhr.addEventListener('load',()=>{
  console.log(xhr.response)
})

xhr.open('GET', 'https://supersimplebackend.dev');
//first param: get some info form the backend
//second param: where to send the HTTP message URL
xhr.send(); //asyncronous code
//xhr.response wait for response so add event listner instead