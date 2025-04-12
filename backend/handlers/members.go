package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"go.mod/config"
	"go.mod/models"

	"github.com/gorilla/mux"
)

func GetMembers(w http.ResponseWriter, r *http.Request) {
	db, err := config.GetDB()
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query("SELECT id, name, department, experience FROM members")
	if err != nil {
		http.Error(w, "Query error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var members []models.Member
	for rows.Next() {
		var member models.Member
		if err := rows.Scan(&member.ID, &member.Name, &member.Department, &member.Experience); err != nil {
			http.Error(w, "Scan error", http.StatusInternalServerError)
			return
		}
		members = append(members, member)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(members)
}

func CreateMember(w http.ResponseWriter, r *http.Request) {
	var member models.Member
	if err := json.NewDecoder(r.Body).Decode(&member); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	db, err := config.GetDB()
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	result, err := db.Exec(
		"INSERT INTO members (name, department, experience) VALUES (?, ?, ?)",
		member.Name, member.Department, member.Experience,
	)
	if err != nil {
		http.Error(w, "Insert error", http.StatusInternalServerError)
		return
	}

	id, _ := result.LastInsertId()
	member.ID = int(id)

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(member)
}

func UpdateMember(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var member models.Member
	if err := json.NewDecoder(r.Body).Decode(&member); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	db, err := config.GetDB()
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	_, err = db.Exec(
		"UPDATE members SET name = ?, department = ?, experience = ? WHERE id = ?",
		member.Name, member.Department, member.Experience, id,
	)
	if err != nil {
		http.Error(w, "Update error", http.StatusInternalServerError)
		return
	}

	member.ID = id
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(member)
}

func DeleteMember(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	db, err := config.GetDB()
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	result, err := db.Exec("DELETE FROM members WHERE id = ?", id)
	if err != nil {
		http.Error(w, "Delete error", http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Member not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Member deleted"})
}
