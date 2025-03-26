document.addEventListener('DOMContentLoaded', function() {
  // Данные товаров
  const productsData = [
    {
      id: 1,
      title: "Портативная игровая консоль Steam Deck OLED 512 ГБ",
      specs: "[7.4\", OLED, 1280 × 800, Touchscreen, Wi-Fi, BT, черный]",
      price: 79999,
      oldPrice: 99990,
      image: "images/steam-deck.png",
      category: "computers"
    },
    {
      id: 2,
      title: "Смартфон iPhone 15 Pro 256GB",
      specs: "[6.1\", OLED, 2556 × 1179, A17 Pro, 48MP, титан]",
      price: 129990,
      oldPrice: 150000,
      image: "images/iphone.jpg",
      category: "phones"
    },
    {
      id: 3,
      title: "Ноутбук MacBook Air M2 13\" 256GB",
      specs: "[13.6\", IPS, 2560 × 1664, Apple M2, 8GB RAM]",
      price: 119990,
      oldPrice: 99990,
      image: "images/macbook.jpg",
      category: "computers"
    },
    {
      id: 4,
      title: "Телевизор Samsung QE55Q70BAUXRU",
      specs: "[55\", QLED, 3840 × 2160, HDR10+, Smart TV]",
      price: 89990,
      oldPrice: 99990,
      image: "images/tv.png",
      category: "appliances"
    },
    {
      id: 5,
      title: "Наушники Sony WH-1000XM5",
      specs: "[Беспроводные, ANC, 30 ч работы, черные]",
      price: 34990,
      image: "images/uhi.jpg",
      category: "audio"
    },
    {
      id: 6,
      title: "Игровая мышь Razer DeathAdder V3",
      specs: "[Проводная, 26000 DPI, 8 кнопок, черная]",
      price: 8990,
      image: "images/mouse.jpg",
      category: "components"
    },
    {
      id: 7,
      title: "Клавиатура Logitech MX Keys",
      specs: "[Беспроводная, подсветка, Bluetooth, USB-C]",
      price: 12990,
      image: "images/key.webp",
      category: "components"
    },
    {
      id: 8,
      title: "Монитор Dell S2721QS 27\"",
      specs: "[27\", IPS, 3840 × 2160, 60Hz, HDR]",
      price: 34990,
      image: "images/monitor.jpg",
      category: "components"
    }
  ];

  // Элементы DOM
  const productsContainer = document.getElementById('productsContainer');
  const recentlyViewedContainer = document.getElementById('recentlyViewed');
  const searchInput = document.getElementById('searchInput');
  const results = document.getElementById('results');
  const cartButton = document.getElementById('cartButton');
  const cartModal = document.getElementById('cartModal');
  const closeCartModal = document.getElementById('closeCartModal');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartCounter = document.getElementById('cartCounter');
  const cartTotalPrice = document.getElementById('cartTotalPrice');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const bottomMenu = document.getElementById('bottomMenu');

  // Корзина
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

  // Инициализация
  renderProducts(productsData);
  renderRecentlyViewed();
  updateCartCounter();

  // Обработчики событий
  mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  cartButton.addEventListener('click', openCartModal);
  closeCartModal.addEventListener('click', closeCart);
  searchInput.addEventListener('input', handleSearch);
  document.addEventListener('click', closeSearchResultsOnClickOutside);

  // Функции
  function renderProducts(products) {
    productsContainer.innerHTML = '';
    products.forEach(product => {
      const productElement = createProductElement(product);
      productsContainer.appendChild(productElement);
    });
  }

  function createProductElement(product) {
    const productElement = document.createElement('div');
    productElement.className = 'product';
    productElement.dataset.id = product.id;
    
    let priceHTML = `<p class="price">${formatPrice(product.price)} ₽</p>`;
    if (product.oldPrice) {
      priceHTML += `<span class="discount-price">${formatPrice(product.oldPrice)} ₽</span>`;
    }

    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="product-image" />
      <div class="product-info">
        <p class="product-title">${product.title}</p>
        <p class="product-specs">${product.specs}</p>
        <div class="product-actions">
          <button class="buy-button">Купить</button>
          <button class="cart-button">В корзину</button>
        </div>
        <div class="product-price">
          ${priceHTML}
        </div>
      </div>
    `;

    // Обработчики для кнопок товара
    productElement.querySelector('.buy-button').addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(product.id, true);
    });

    productElement.querySelector('.cart-button').addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(product.id);
    });

    productElement.addEventListener('click', () => {
      viewProductDetails(product.id);
    });

    return productElement;
  }

  function addToCart(productId, isBuyNow = false) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    saveCart();
    updateCartCounter();
    
    if (isBuyNow) {
      openCartModal();
    } else {
      showAddToCartNotification(product.title);
    }
  }

  function showAddToCartNotification(productTitle) {
    const notification = document.createElement('div');
    notification.className = 'notification fade-in';
    notification.innerHTML = `
      <p>Товар "${productTitle}" добавлен в корзину!</p>
    `;
    
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--primary-color)';
    notification.style.color = 'white';
    notification.style.padding = '1rem';
    notification.style.borderRadius = 'var(--border-radius)';
    notification.style.boxShadow = 'var(--box-shadow)';
    notification.style.zIndex = '3000';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.5s';
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }

  function viewProductDetails(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    // Добавляем в просмотренные
    if (!recentlyViewed.some(p => p.id === productId)) {
      recentlyViewed.unshift({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image
      });
      
      if (recentlyViewed.length > 4) {
        recentlyViewed = recentlyViewed.slice(0, 4);
      }
      
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
      renderRecentlyViewed();
    }

    // Здесь можно реализовать переход на страницу товара
    console.log('Просмотр товара:', product.title);
    // window.location.href = `product.html?id=${productId}`;
  }

  function renderRecentlyViewed() {
    if (recentlyViewed.length === 0) return;
    
    recentlyViewedContainer.innerHTML = '';
    recentlyViewed.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'recent-product';
      productElement.dataset.id = product.id;
      
      productElement.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="recent-image" />
        <p class="recent-title">${product.title}</p>
        <p class="recent-price">${formatPrice(product.price)} ₽</p>
      `;
      
      productElement.addEventListener('click', () => {
        viewProductDetails(product.id);
      });
      
      recentlyViewedContainer.appendChild(productElement);
    });
  }

  function handleSearch() {
    const query = searchInput.value.toLowerCase();
    results.innerHTML = '';
  
    if (query === '') {
      results.style.display = 'none';
      return;
    }
  
    const filteredProducts = productsData.filter(product => 
      product.title.toLowerCase().includes(query) || 
      product.specs.toLowerCase().includes(query)
    );
  
    if (filteredProducts.length > 0) {
      filteredProducts.forEach(product => {
        const li = document.createElement('li');
        li.textContent = product.title;
        li.dataset.id = product.id;
        results.appendChild(li);
      });
      results.style.display = 'block';
    } else {
      results.style.display = 'none';
    }
  }

  function closeSearchResultsOnClickOutside(e) {
    if (!searchInput.contains(e.target) && !results.contains(e.target)) {
      results.style.display = 'none';
    }
  }

  function openCartModal() {
    renderCartItems();
    cartModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
      cartTotalPrice.textContent = '0';
      return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
      total += item.price * item.quantity;
      
      const cartItemElement = document.createElement('div');
      cartItemElement.className = 'cart-item';
      cartItemElement.dataset.id = item.id;
      
      cartItemElement.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="cart-item-image" />
        <div class="cart-item-info">
          <p class="cart-item-title">${item.title}</p>
          <p class="cart-item-price">${formatPrice(item.price)} ₽</p>
          <div class="cart-item-actions">
            <input type="number" min="1" value="${item.quantity}" class="cart-item-quantity">
            <span class="remove-item">✕</span>
          </div>
        </div>
      `;
      
      // Обработчики для изменения количества и удаления
      const quantityInput = cartItemElement.querySelector('.cart-item-quantity');
      quantityInput.addEventListener('change', (e) => {
        updateCartItemQuantity(item.id, parseInt(e.target.value));
      });
      
      const removeButton = cartItemElement.querySelector('.remove-item');
      removeButton.addEventListener('click', () => {
        removeFromCart(item.id);
      });
      
      cartItemsContainer.appendChild(cartItemElement);
    });
    
    cartTotalPrice.textContent = formatPrice(total);
  }

  function updateCartItemQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity = newQuantity;
      saveCart();
      renderCartItems();
      updateCartCounter();
    }
  }

  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
    updateCartCounter();
  }

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalItems;
  }

  function toggleMobileMenu() {
    bottomMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
  }

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  // Обработчик кликов по результатам поиска
  results.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      const productId = parseInt(e.target.dataset.id);
      viewProductDetails(productId);
      searchInput.value = '';
      results.style.display = 'none';
    }
  });

  // Закрытие корзины при клике вне модального окна
  window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      closeCart();
    }
  });
});