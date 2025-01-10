package main

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func OpenDatabase() error{
	var err error;
	dsn := "host=localhost user=postgres password=123456 dbname=connecting_postgres port=5432 sslmode=disable TimeZone=Asia/Ho_Chi_Minh"
	DB, err = gorm.Open(postgres.Open(dsn),&gorm.Config{})
	if err != nil{
		return err
	}
	//Tự động tạo bảng nếu chưa tồn tại
	err = DB.AutoMigrate(&Todo{},&User{})
	if err != nil{
		return err
	}

	log.Println("Connected to the database and migrated successfully")
	return nil
}

