// Classe pour représenter un produit
class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

// Classe pour représenter un article dans le panier
class CartItem {
    constructor(product, quantity = 1) {
        this.product = product;
        this.quantity = quantity;
    }

    // Calculer le total pour cet article
    calculateTotal() {
        return this.product.price * this.quantity;
    }
}

// Classe principale du panier
class ShoppingCart {
    constructor() {
        this.items = [];
    }

    // Obtenir le nombre total d'articles
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Obtenir le prix total du panier
    getTotalPrice() {
        return this.items.reduce((total, item) => total + item.calculateTotal(), 0);
    }

    // Ajouter un article au panier
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push(new CartItem(product, quantity));
        }
        
        this.updateDisplay();
    }

    // Supprimer un article du panier
    removeItem(productId) {
        const index = this.items.findIndex(item => item.product.id === productId);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.updateDisplay();
        }
    }

    // Mettre à jour la quantité d'un article
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.updateDisplay();
            }
        }
    }

    // Afficher le contenu du panier
    updateDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartCountElement = document.getElementById('cart-count');
        const totalElement = document.getElementById('total');
        const cartTotalElement = document.getElementById('cart-total');

        // Mettre à jour le compteur
        cartCountElement.textContent = this.getTotalItems();

        // Mettre à jour l'affichage des articles
        cartItemsContainer.innerHTML = '';
        this.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <div class="cart-item">
                    <span>${item.product.name}</span>
                    <span>${item.quantity} x ${item.product.price} FCFA</span>
                    <span>Total: ${item.calculateTotal()} FCFA</span>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        // Mettre à jour les totaux
        const total = this.getTotalPrice();
        totalElement.textContent = `${total} FCFA`;
        cartTotalElement.textContent = `${total} FCFA`;

        // Afficher/masquer le panier
        document.getElementById('cart').style.display = this.items.length > 0 ? 'block' : 'none';
    }
}

// Initialisation et gestion des événements
document.addEventListener('DOMContentLoaded', () => {
    // Créer le panier
    const cart = new ShoppingCart();

    // Créer les produits à partir des cartes existantes
    const cards = document.querySelectorAll('.card');
    const products = Array.from(cards).map((card, index) => {
        const name = card.querySelector('.card-title').textContent;
        const price = parseInt(card.querySelector('.card-text').textContent);
        return new Product(index + 1, name, price);
    });

    // Gérer les boutons d'ajout/retrait
    cards.forEach((card, index) => {
        const product = products[index];
        const plusBtn = card.querySelector('.quantity-plus');
        const minusBtn = card.querySelector('.quantity-minus');
        const deleteBtn = card.querySelector('.delete-item');
        const quantitySpan = card.querySelector('.item-quantity');

        plusBtn.addEventListener('click', () => {
            const currentQuantity = parseInt(quantitySpan.textContent) || 0;
            quantitySpan.textContent = currentQuantity + 1;
            cart.addItem(product, 1);
        });

        minusBtn.addEventListener('click', () => {
            const currentQuantity = parseInt(quantitySpan.textContent) || 0;
            if (currentQuantity > 0) {
                quantitySpan.textContent = currentQuantity - 1;
                cart.updateQuantity(product.id, currentQuantity - 1);
            }
        });

        deleteBtn.addEventListener('click', () => {
            quantitySpan.textContent = '0';
            cart.removeItem(product.id);
            deleteBtn.style.display = 'none';
        });
    });
});