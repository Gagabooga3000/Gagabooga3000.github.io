const items = ["Смартфон", "Ноутбук", "Планшет", "Футболка", "Книга"];
const searchInput = document.getElementById('searchInput');
const results = document.getElementById('results');

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  results.innerHTML = '';

  if (query === '') {
    results.style.display = 'none'; // Скрываем результаты, если поле пустое
    return;
  }

  const filteredItems = items.filter(item => item.toLowerCase().includes(query));

  if (filteredItems.length > 0) {
    filteredItems.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      results.appendChild(li);
    });
    results.style.display = 'block'; // Показываем результаты
  } else {
    results.style.display = 'none'; // Скрываем результаты, если ничего не найдено
  }
});

// Закрыть результаты при клике вне поля поиска
document.addEventListener('click', function (event) {
  if (!searchInput.contains(event.target) && !results.contains(event.target)) {
    results.style.display = 'none';
  }
});
