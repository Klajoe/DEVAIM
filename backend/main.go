package main

import (
	"encoding/json"
	"log"
	"net/http"
	"runtime"
	"sync"
	"time"

	"github.com/gorilla/mux"
	"go.mod/handlers"
)

type User struct {
	Name       string `json:"name"`
	Department string `json:"department"`
	Experience string `json:"experience"`
}

var (
	users = []User{
		{"Arda", "Backend", "3 Year"},
		{"Ayşe", "Frontend", "2 Year"},
		{"Mehmet", "DevOps", "4 Year"},
		{"Elif", "QA", "1 Year"},
		{"Can", "Ops", "5 Year"},
	}
	usersMutex sync.Mutex
)

type SystemMetrics struct {
	MemoryAlloc  uint64 `json:"memory_alloc"`
	NumGoroutine int    `json:"num_goroutine"`
	Timestamp    int64  `json:"timestamp"`
}

var logsData = []string{
	"Server started",
	"User Arda logged in",
	"Merge request created",
}
var logsMutex sync.Mutex

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow requests from http://localhost:3000
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Pass the request to the next handler
		next.ServeHTTP(w, r)
	})
}

func main() {
	// Create a new gorilla/mux router
	r := mux.NewRouter()

	// Static file serving for the React frontend
	r.HandleFunc("/", serveFile).Methods("GET")
	// Serve other static assets (e.g., /static/js/*, /static/css/*)
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./frontend/build/static"))))

	// API endpoints
	r.HandleFunc("/api/login", handlers.Login).Methods("POST")
	r.HandleFunc("/api/register", handlers.Register).Methods("POST")
	r.HandleFunc("/api/forgot-password", handlers.ForgotPassword).Methods("POST")

	// Members endpoints
	r.HandleFunc("/api/members", handlers.GetMembers).Methods("GET")
	r.HandleFunc("/api/members", handlers.CreateMember).Methods("POST")
	r.HandleFunc("/api/members/{id}", handlers.UpdateMember).Methods("PUT")
	r.HandleFunc("/api/members/{id}", handlers.DeleteMember).Methods("DELETE")

	// Other API endpoints (assuming these handlers exist)
	r.HandleFunc("/api/adduser", addUserHandler).Methods("POST") // Adjust method as needed
	r.HandleFunc("/api/monitor", monitorHandler).Methods("GET")  // Adjust method as needed
	r.HandleFunc("/api/logs", logsHandler).Methods("GET")        // Adjust method as needed
	r.HandleFunc("/api/deploy", deployHandler).Methods("POST")   // Adjust method as needed

	// Tasks routes
	r.HandleFunc("/api/tasks", handlers.GetTasks).Methods("GET")
	r.HandleFunc("/api/tasks", handlers.CreateTask).Methods("POST")
	r.HandleFunc("/api/tasks/{id}", handlers.UpdateTask).Methods("PUT")
	r.HandleFunc("/api/tasks/{id}", handlers.DeleteTask).Methods("DELETE")

	// Apply CORS middleware
	handler := enableCORS(r)

	log.Println("Sunucu port 8080'de çalışıyor...")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

// serveFile serves static files and adds CORS headers
func serveFile(w http.ResponseWriter, r *http.Request) {

	path := r.URL.Path
	if path == "/" {
		http.ServeFile(w, r, "index.html")
	} else {
		// Dosya yolunun başındaki "/" karakterini kaldırarak dosyayı sunuyoruz.
		http.ServeFile(w, r, path[1:])
	}
}

// addUserHandler adds a new user and includes CORS headers
func addUserHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method == http.MethodOptions {
		// Handle preflight request
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Sadece POST yöntemi destekleniyor", http.StatusMethodNotAllowed)
		return
	}
	var newUser User
	if err := json.NewDecoder(r.Body).Decode(&newUser); err != nil {
		http.Error(w, "Veri hatalı", http.StatusBadRequest)
		return
	}
	usersMutex.Lock()
	users = append(users, newUser)
	usersMutex.Unlock()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newUser)
}

// monitorHandler returns system metrics and includes CORS headers
func monitorHandler(w http.ResponseWriter, r *http.Request) {
	// Add CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		// Handle preflight request
		w.WriteHeader(http.StatusOK)
		return
	}

	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	metrics := SystemMetrics{
		MemoryAlloc:  m.Alloc,
		NumGoroutine: runtime.NumGoroutine(),
		Timestamp:    time.Now().Unix(),
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(metrics)
}

// logsHandler returns logs and includes CORS headers
func logsHandler(w http.ResponseWriter, r *http.Request) {
	// Add CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		// Handle preflight request
		w.WriteHeader(http.StatusOK)
		return
	}

	logsMutex.Lock()
	defer logsMutex.Unlock()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(logsData)
}

// deployHandler simulates a deployment and includes CORS headers
func deployHandler(w http.ResponseWriter, r *http.Request) {
	// Add CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		// Handle preflight request
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Sadece POST yöntemi destekleniyor", http.StatusMethodNotAllowed)
		return
	}
	// Deployment işlemini simüle ediyoruz.
	time.Sleep(2 * time.Second)
	result := map[string]string{
		"status": "Deployment başarılı şekilde tetiklendi",
	}
	logsMutex.Lock()
	logsData = append(logsData, "Deployment tetiklendi: "+time.Now().Format(time.RFC1123))
	logsMutex.Unlock()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}
