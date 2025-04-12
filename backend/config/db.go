package config

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

func GetDB() (*sql.DB, error) {
	dsn := "root:Str0ngP@ssw0rd!@tcp(127.0.0.1:3306)/auth_db"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		fmt.Println("sql.Open error:", err)
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		fmt.Println("db.Ping error:", err)
		return nil, err
	}

	fmt.Println("Successfully connected to MySQL!")
	return db, nil
}
