package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/lib/pq"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

// Структура для анализа входящих данных
type AuthRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Структура для соединения с базой данных
var db *sql.DB

// Функция для инициализации базы данных
func initDB() {
	var err error
	connStr := "user=postgres dbname=site sslmode=disable"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
}

// Функция для регистрации пользователя
func registerHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Метод не разрешен", http.StatusMethodNotAllowed)
		log.Printf("Попытка использования недопустимого метода: %s", r.Method)
		return
	}

	var req AuthRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Ошибка обработки JSON", http.StatusBadRequest)
		log.Printf("Ошибка обработки JSON: %v", err)
		return
	}

	// Хешируем пароль
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Ошибка хеширования пароля", http.StatusInternalServerError)
		log.Printf("Ошибка хеширования пароля: %v", err)
		return
	}

	// Записываем пользователя в базу данных
	_, err = db.Exec("INSERT INTO users (email, password_hash) VALUES ($1, $2)", req.Email, passwordHash)
	if err != nil {
		// Если ошибка связана с уникальностью (email уже существует)
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
			http.Error(w, "Пользователь с таким email уже существует", http.StatusConflict)
			log.Printf("Ошибка регистрации: пользователь с email %s уже существует", req.Email)
			return
		}
		http.Error(w, "Ошибка при регистрации", http.StatusInternalServerError)
		log.Printf("Ошибка при регистрации: %v", err)
		return
	}

	log.Printf("Пользователь %s успешно зарегистрирован", req.Email)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Пользователь успешно зарегистрирован"})
}

// Функция для входа пользователя
func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Метод не разрешен", http.StatusMethodNotAllowed)
		log.Printf("Попытка использования недопустимого метода: %s", r.Method)
		return
	}

	var req AuthRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Ошибка обработки JSON", http.StatusBadRequest)
		log.Printf("Ошибка обработки JSON: %v", err)
		return
	}

	var storedHash string
	err = db.QueryRow("SELECT password_hash FROM users WHERE email = $1", req.Email).Scan(&storedHash)
	if err != nil {
		http.Error(w, "Неверные учетные данные", http.StatusUnauthorized)
		log.Printf("Попытка входа с неверными учетными данными для email: %s", req.Email)
		return
	}

	// Сравниваем хеш
	err = bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(req.Password))
	if err != nil {
		http.Error(w, "Неверные учетные данные", http.StatusUnauthorized)
		log.Printf("Неверный пароль для пользователя: %s", req.Email)
		return
	}

	log.Printf("Пользователь %s успешно вошел", req.Email)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Успешный вход"})
}

func main() {
	initDB()
	http.HandleFunc("/register", registerHandler)
	http.HandleFunc("/login", loginHandler)

	log.Println("Сервер запущен на порту 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}
