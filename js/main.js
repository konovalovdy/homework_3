const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// let getRequest = (url, cb) => {
//     let xhr = new XMLHttpRequest();
//     // window.ActiveXObject -> xhr = new ActiveXObject()
//     xhr.open("GET", url, true);
//     xhr.onreadystatechange = () => {
//         if(xhr.readyState === 4){
//             if(xhr.status !== 200){
//                 console.log('Error');
//             } else {
//                 cb(xhr.responseText);
//             }
//         }
//     };
//     xhr.send();
// };

class ProductsList {
    constructor(container = '.products'){
        this.container = container;
        this.goods = [];//массив товаров из JSON документа
        this._getProducts()
            .then(data => { //data - объект js
                 this.goods = data;
//                 console.log(data);
                 this.render()
            });
    }
    _getProducts(){
      
        return fetch(`${API}/catalogData.json`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            });
       
    }
    calcSum(){
        return this.allProducts.reduce((accum, item) => accum += item.price, 0);
    }
    render(){
        const block = document.querySelector(this.container);
        for (let product of this.goods){
            const productObj = new ProductItem(product);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }

    }
}


class ProductItem {
    constructor(product, img = 'https://via.placeholder.com/200x150'){
        this.title = product.product_name;
        this.price = product.price;
        this.id = product.id_product;
        this.img = img;
    }
    render(){
        return `<div class="product-item" data-id="${this.id}">
                <img src="${this.img}" alt="Some img">
                <div class="desc">
                    <h3>${this.title}</h3>
                    <p>${this.price} $</p>
                    <button class="buy-btn" data-id = "${this.id}">Купить</button>
                </div>
            </div>`
    }
}


class Cart {
    constructor (productsList, container = '.cart_container') {
        this.container = container;
        this.productsList = productsList;
        this.cartList = [];
        this.cartButton = document.querySelector(".btn-cart");
        this._getCartProducts()
            .then(data => { //data - объект js
                 this.cartList = data.contents;
//                 console.log(data);
                 //this.render()
            });
        this.init();
    }
    _getCartProducts(){
        return fetch(`${API}/getBasket.json`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            });
       
    }

    render(){
        const block = document.querySelector(this.container);
        block.innerHTML = "";
        for (let product of this.cartList){
            const productObj = new cartItem(product);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }
        if (this.cartList.length === 0) {
            block.innerHTML = "<H2>Ваша корзина пуста<H2>";
        }

    }
    
    init () {
        this.cartButton.addEventListener("click", ()=>this.openCart());
        const container = document.querySelector(".products");
        container.addEventListener("click", (obj)=>this.addToCart(obj));
        const cart = document.querySelector(".cart_container");
        cart.addEventListener("click", (obj)=>this.removeFromCart(obj));
    }
    getProductsList () {
        console.log (this.productsList.goods);
        return this.productsList.goods;
    }
    addToCart (obj) {
        if (obj.target.className === "buy-btn") {
            for (let product of this.productsList.goods) {
                if (obj.target.dataset.id === String(product.id_product)) {
                    for (let item of this.cartList) {
                        if (obj.target.dataset.id === String(item.id_product)) {
                            item.quantity += 1;
                            this.render()
                            return;
                        }
                    }
                    product.quantity = 1;
                    this.cartList.push(product);
                    this.render();
                }
            }
        }
    }

    removeFromCart (obj) {
        if (obj.target.className === "rmv-btn") {
            for (let item of this.cartList) {
                if (obj.target.dataset.id === String(item.id_product)) {
                    if (item.quantity > 1) {
                        item.quantity -= 1;
                        this.render();
                    }
                    if (item.quantity === 1) {
                        const removed = this.cartList.indexOf(item);
                        this.cartList.splice(removed, removed+1);
                        this.render();
                    }
                }
            }
        }
    }

    openCart () {
            this.render();
            const container = document.querySelector(".cart");
            if (container.style.display === "none") {
                container.style.display = "flex";
                return;
            }
            if (container.style.display === "flex") {
                container.style.display = "none";
                return;   
            }
            
        }
    }

    class cartItem {
        constructor(product, img = 'https://via.placeholder.com/200x150'){
        this.title = product.product_name;
        this.price = product.price;
        this.id = product.id_product;
        this.quantity = product.quantity
        this.img = img;
        }
        render() {
            return `<div class="cart_product">
            <div class="cart_pic"><img class="pic" src="${this.img}" alt="Some img"></div>
            <div class="cart_info">
                <div class="cart_name"><H3>${this.title}</H3></div>
                <div class="cart_quantity"><H4>${this.quantity}</H4></div>
                <div class="cart_price">$ ${this.price} за шт.</div>
            </div>
            <div class="cart_calc">
                <div class="cart_total"><H2>${this.price * this.quantity}</H2></div>
                <div class="cart_del"><button data-id = "${this.id}" class="rmv-btn">X</button></div>
            </div>
        </div>`
        }
    }

let list = new ProductsList();
let cart = new Cart(list);


