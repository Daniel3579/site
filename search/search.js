document.addEventListener('DOMContentLoaded', () => {
    loadUsers(); // Начальная загрузка пользователей

    const applyFilters = document.getElementById('applyFilters');
    const resetFilters = document.getElementById('resetFilters');
    const filterButton = document.getElementById('filterButton');
    const filterContainer = document.querySelector('.filter-container');

    // Функция для начальной загрузки пользователей
    function loadUsers() {
        for (let i = 6; i <= 38; i++) {
            const img = document.createElement('img');
            img.src = `../images/Screenshot_${i}.png`;
            document.getElementById('userGrid').appendChild(img);
        }
    }

    // Обработчик события для кнопки "Применить"
    applyFilters.addEventListener('click', () => {
        const ageFrom = document.getElementById('ageFrom').value;
        const ageTo = document.getElementById('ageTo').value;
        const heightFrom = document.getElementById('heightFrom').value;
        const heightTo = document.getElementById('heightTo').value;
        const weightFrom = document.getElementById('weightFrom').value;
        const weightTo = document.getElementById('weightTo').value;

        // Логика фильтрации пользователей (можно добавить POST запрос для фильтрации на сервере)
        console.log({
            ageFrom,
            ageTo,
            heightFrom,
            heightTo,
            weightFrom,
            weightTo
        });

        // Здесь можно добавить логику для обновления отображаемых пользователей на основе фильтров
        // Для этого вы можете обновить loadUsers или получить данные с сервера
    });

    // Обработчик события для кнопки "Сбросить"
    resetFilters.addEventListener('click', () => {
        document.getElementById('ageFrom').value = '';
        document.getElementById('ageTo').value = '';
        document.getElementById('heightFrom').value = '';
        document.getElementById('heightTo').value = '';
        document.getElementById('weightFrom').value = '';
        document.getElementById('weightTo').value = '';
    });

    // Обработчик для кнопки "Filter" на мобильной версии
    filterButton.addEventListener('click', () => {
        filterContainer.classList.toggle('visible');
    });
});
