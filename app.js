// variables    

const cartBtn = document.querySelector('.cart-btn')
const closeCartBtn = document.querySelector('.close-cart')
const clearCartBtn = document.querySelector('.clear-cart')
const cartDOM = document.querySelector('.cart')
const cartOverlay = document.querySelector('.cart-overlay')
const cartItems = document.querySelector('.cart-items')
const cartTotal = document.querySelector('.cart-total')
const cartContent = document.querySelector('.cart-content')
const productsDOM = document.querySelector('.products-center')

// cart
let cart = JSON.parse(localStorage.getItem('cart')) || []
// btns
let buttonsDOM = []




window.addEventListener('DOMContentLoaded', displayProducts)



// functions 
async function getProducts() {
    try {
        const response = await fetch('products.json')

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        //console.log(url);
        const data = await response.json()
        //console.log(data);
        return data

    } catch (error) {
        console.log(error);
    }

}
getProducts()

// show itemss

async function displayProducts() {

    let items = await getProducts()
    items = (items.items)


    items = items.map((item) => {
        let id = item.sys.id
        let image = item.fields.image.fields.file.url
        let price = item.fields.price
        let title = item.fields.title
        return { id, title, image, price }
    })

    items.forEach((item) => {
        article = document.createElement('article')
        article.setAttribute('class', 'product')
        article.innerHTML = `<div class="img-container">
    <img src=${item.image} alt="product" class="product-img">
    <button class="bag-btn" data-id="${item.id}">
        <i class="fas fa-shopping-cart">add to Cart</i>
    </button>
    </div>
    <h3>${item.title}</h3>
    <h4>$${item.price}</h4>`

        productsDOM.appendChild(article)



    })

    //console.log(productsDOM);

    // local storage all products
    localStorage.setItem('products', JSON.stringify(items))



    // buttons
    const addToCartBtn = [...document.querySelectorAll('.bag-btn')]
    //console.log(addToCartBtn);

    addToCartBtn.forEach((btn) => {
        //console.log(btn);
        let id = btn.dataset.id

        let inCart = cart.find((item) => item.id == id)
        //console.log(inCart);

        if (inCart) {
            btn.innerText = "In Cart";
            btn.disabled = true
        }

        btn.addEventListener('click', (event) => {
            //console.log(btn.currentTarget);

            event.currentTarget.innerText = "In Cart";
            event.currentTarget.disabled = true;

            // add to local storage
            let addItem = getLocalStorage(id)
            addItem = { ...addItem, amount: 1 }

            cart = [...cart, addItem]
            console.log(cart);

            addToCart(cart)
            updateCartItemsTotal(cart)
            updateCartPrice(cart)



            // LOCAL STORAGE
            localStorage.setItem('cart', JSON.stringify(cart))


        })


    })

    // CLEAR CART

    clearCartBtn.addEventListener('click', clearCart)

    function clearCart() {
        cartProducts = document.querySelectorAll('.cart-item')
        //console.log(cartProducts);
        cartProducts.forEach((product) => {
            console.log(product);
            cartContent.removeChild(product)
        })
        cart = []
        setLocalStorage(cart)
        updateCartItemsTotal(cart)
        updateCartPrice(cart)


        // enable buttons

        const buttons = [...document.querySelectorAll('.bag-btn')]
        console.log(buttons);

        function enableBtns() {
            buttons.forEach((btn) => {
                //console.log(btn);
                btn.innerHTML = '<i class="fas fa-shopping-cart">add to Cart</i>'
                btn.disabled = false
            })


        }

        enableBtns()

    }

    // CART LOGIC

    cartContent.addEventListener('click', (event) => {

        //console.log(event.target);

        if (event.target.classList.contains('remove-item')) {
            console.log('remove');
            const id = (event.target.dataset.id)
            const itemToRemove = (event.target.parentNode.parentNode);
            cartContent.removeChild(itemToRemove)

            // remove from cart

            cart = cart.filter(item => item.id !== id);
            console.log(cart);

            // remove from local storage
            setLocalStorage(cart)

            // enable button
            const buttons = [...document.querySelectorAll('.bag-btn')]
            console.log(buttons);

            buttons.forEach((btn) => {

                if (btn.dataset.id == id) {
                    btn.innerHTML = '<i class="fas fa-shopping-cart">add to Cart</i>'
                    btn.disabled = false
                }
            })

            // update cart number
            updateCartItemsTotal(cart)
            updateCartPrice(cart)

        }

        if (event.target.classList.contains('fa-chevron-up')) {
            let element = (event.target);
            let id = event.target.dataset.id
            //console.log(id);
            cart.forEach((product) => {
                if (product.id == id) {
                    product.amount += 1
                    let itemAmount = (element.nextElementSibling);
                    itemAmount.innerText = product.amount
                }
            })

            setLocalStorage(cart)
            updateCartPrice(cart)
        }
        if (event.target.classList.contains('fa-chevron-down')) {
            console.log(event.target);
            let element = (event.target);
            let id = event.target.dataset.id
            //console.log(id);
            cart.forEach((product) => {
                if (product.id == id) {
                    product.amount = product.amount - 1
                    if (product.amount == 0) {
                        const itemToRemove = (event.target.parentNode.parentNode);
                        cartContent.removeChild(itemToRemove)
                        cart = cart.filter(item => item.id != id)
                    }
                    let itemAmount = (element.previousElementSibling);
                    itemAmount.innerText = product.amount
                    console.log(cart);
                }
            })
            updateCartItemsTotal(cart)
            setLocalStorage(cart)
            updateCartPrice(cart)
        }

    })


}




// CART

// open cart

cartBtn.addEventListener('click', () => {
    cartOverlay.classList.add('transparentBcg')
    cartDOM.classList.add('showCart')
})

// close cart

closeCartBtn.addEventListener('click', () => {
    cartOverlay.classList.remove('transparentBcg')
    cartDOM.classList.remove('showCart')
})

// add to cart

function addToCart(cart) {

    let result = ''

    cartContent.innerHTML = ''

    cart.map((item) => {
        let div = document.createElement('div')
        div.setAttribute('class', 'cart-item')
        div.innerHTML = `
         <img src="${item.image}" alt="product">
         <div>
             <h4>${item.title}</h4>
             <h5>$${item.price}</h5>
             <span class="remove-item" data-id="${item.id}">remove</span>
         </div>
         <div>
             <i class="fas fa-chevron-up" data-id="${item.id}"></i>
             <p class="item-amount">${item.amount}</p>
             <i class="fas fa-chevron-down" data-id="${item.id}"></i>
         </div>`

        cartContent.appendChild(div)
    })
}
addToCart(cart)

// CART ITEMS 

function updateCartItemsTotal(cart) {
    cartItems.innerHTML = cart.length
}
updateCartItemsTotal(cart)

// CART TOTAL

function updateCartPrice(cart) {
    let totalValue = 0


    cart.forEach((product) => {
        //console.log(product.price);
        //console.log(product.amount);
        totalValue += product.price * product.amount
        cartTotal.innerText = parseFloat(totalValue.toFixed(2))
    })

    if (cart.length == 0) {
        totalValue = 0
        cartTotal.innerText = parseFloat(totalValue.toFixed(2))
        cartOverlay.classList.remove('transparentBcg')
        cartDOM.classList.remove('showCart')
    }

    //console.log(totalValue);
}
updateCartPrice(cart)








// LOCAL STORAGE


// get item from products in local storage
function getLocalStorage(id) {
    let products = JSON.parse(localStorage.getItem('products'))
    return products.find((product) => product.id === id)
}

function setLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
}
















































/* 
async function fetchProducts() {
    try {
      const response = await fetch('products.json');
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    }
    catch (error) {
      console.error(`Could not get products: ${error}`);
    }
  }
  
  const promise = fetchProducts();
  promise.then((data) => console.log(data));
   */