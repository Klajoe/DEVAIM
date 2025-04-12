package models

type Member struct {
	ID         int    `json:"id"`
	Name       string `json:"name"`
	Department string `json:"department"`
	Experience string `json:"experience"`
}
