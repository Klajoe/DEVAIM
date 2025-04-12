package models

type Task struct {
	ID          int    `json:"id"`
	Date        string `json:"date"` // YYYY-MM-DD
	Description string `json:"description"`
	Status      string `json:"status"` // pending or completed
}
