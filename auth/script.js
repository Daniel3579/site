const authForm = document.getElementById('authForm');
const submitBtn = document.getElementById('submitBtn');
const toggleSignUp = document.getElementById('toggleSignUp');
const additionalField = document.getElementById('additionalField');
const errorMessage = document.getElementById('errorMessage');
const confirmPasswordInput = document.getElementById('confirmPassword');

let isSignUp = false;

toggleSignUp.addEventListener('click', () => {
    isSignUp = !isSignUp;
    toggleSignUp.textContent = isSignUp ? 'Login' : 'SignUp';
    submitBtn.textContent = isSignUp ? 'Sign Up' : 'Login';
    additionalField.style.display = isSignUp ? 'block' : 'none';
    isSignUp ? confirmPasswordInput.setAttribute('required') : confirmPasswordInput.removeAttribute('required');
    errorMessage.textContent = '';
    authForm.reset();
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    let confirmPassword = '';

    if (isSignUp) {
        confirmPassword = document.getElementById('confirmPassword').value;
        if (password !== confirmPassword) {
            errorMessage.textContent = 'Пароли не совпадают';
            return;
        }
        window.location.href = '../search/search.html';

        // // Отправка POST запроса на localhost:8080/register при регистрации
        // const response = await fetch('localhost:8080/register', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ email, password })
        // });

        // const data = await response.json();

        // if (data.success) {
        //     window.location.href = '/home'; // Перенаправление на главную страницу
        // } else {
        //     errorMessage.textContent = data.message || 'Ошибка при регистрации';
        // }
    } else {
        window.location.href = '../search/search.html';

        // // Отправка POST запроса на localhost:8080/login при авторизации
        // const response = await fetch('http://localhost:8080/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ email, password })
        // });

        // const data = await response.json();

        // if (data.success) {
        //     window.location.href = '/home'; // Перенаправление на главную страницу
        // } else {
        //     errorMessage.textContent = 'Неправильный логин или пароль';
        // }
    }
});
