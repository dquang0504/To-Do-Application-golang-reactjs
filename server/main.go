package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"gorm.io/gorm"
)

type Todo struct{
	ID int `json:"id" gorm:"primaryKey;autoIncrement"`
	Title string `json:"title"`
	Body string `json:"body"`
	Done bool `json:"done"`
}

type User struct{
	ID string `json:"id" gorm:"primaryKey;autoIncrement"`
	Username string `json:"username"`
	Password string `json:"password"`
	Name string `json:"name"`
	Token string `json:"Token"`
}



func main(){

	// Kết nối database
	err := OpenDatabase()
	if err != nil {
		log.Fatalf("error connecting to postgresql: %v", err)
	}
	
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origins, Content-Type, Accept, Authorization",
	}))
	todos := []Todo{} 

	//xem chi tiết
	// app.Get("api/todos/:id",func(c *fiber.Ctx) error{
	// 	if DB == nil{
	// 		return c.Status(500).SendString("Database connection is not initialized")
	// 	}
	// 	println("For some reason it jumped here")
	// 	id,err := c.ParamsInt("id")
	// 	if err != nil{
	// 		return c.Status(401).SendString("Invalid ID")
	// 	}

	// 	//truy xuất database
	// 	specifiedTodo := Todo{}
	// 	result := DB.Find(&specifiedTodo,id)
	// 	if result.Error != nil{
	// 		return c.Status(500).SendString("Error retrieving specified todo");
	// 	}
	// 	return c.JSON(specifiedTodo)
	// })

	//tạo mới 1 todo
	app.Post("/api/todos",func(c *fiber.Ctx) error{
		todo := &Todo{}
		if err := c.BodyParser(todo); err != nil{
			return err
		}
		
		result := DB.Create(&Todo{Title: todo.Title,Body: todo.Body,Done: todo.Done})
		if result.Error != nil{
			return c.Status(500).SendString("Error creating new todo");
		}
		
		return c.JSON(todos)
	})

	//update todo
	app.Patch("/api/todos/:id",func (c *fiber.Ctx) error {
		id,err := c.ParamsInt("id")
		if err != nil{
			return c.Status(400).SendString("Invalid ID")
		}

		todo := new(Todo)
		receivedData := Todo{}
		result := DB.First(&todo,id)

		if result.Error != nil{
			return c.Status(500).SendString("Error retrieving todo!");
		}

		if err := c.BodyParser(&receivedData); err != nil{
			return c.Status(400).SendString("Invalid body")
		}

		todo.Body = receivedData.Body
		todo.Done = receivedData.Done

		DB.Save(todo)

		return c.JSON(todos)
	})

	//xóa todo
	app.Delete("/api/todos/:id",func (c *fiber.Ctx) error {
		id,err := c.ParamsInt("id")
		if err != nil{
			return err
		}

		todo := &Todo{}

		result := DB.Delete(todo,id)

		if result.Error != nil{
			return c.Status(500).SendString("Error retrieving todo")
		}
		return c.JSON(todos)
	})

	//đăng ký
	app.Post("/api/todos/register", func(c *fiber.Ctx) error{
		loginInfo := &User{}
		if err := c.BodyParser(loginInfo); err!=nil{
			return c.Status(400).SendString("Invalid body!");
		}
		result := DB.Create(loginInfo)
		if result.Error != nil{
			return c.Status(500).SendString("Error creating new user");
		}
		return c.JSON(loginInfo)
	})

	app.Post("/api/todos/login", func(c *fiber.Ctx) error{
		loginInfo := &User{}
		if err := c.BodyParser(loginInfo); err!=nil{
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}
		result := DB.Where(&User{Username: loginInfo.Username,Password: loginInfo.Password}).First(loginInfo)
		if result.Error != nil{
			if result.Error == gorm.ErrRecordNotFound {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
					"error": "Invalid username or password",
				})
			}
			return c.Status(500).SendString("Error logging in");
		}
		//successfully logged in
		tokenString, err := CreateToken(loginInfo.Username)
		if err != nil{
			return err
		}
		loginInfo.Token = tokenString
		return c.Status(200).JSON(loginInfo)
	})

	//đổ dữ liệu
	authRoutes := app.Group("/api/todos",AuthMiddleware)
	authRoutes.Get("/getAll",func (c *fiber.Ctx) error {
		if DB == nil {
			return c.Status(500).SendString("Database connection is not initialized")
		}
		result := DB.Order("id asc").Find(&todos)
		if result.Error != nil{
			return c.Status(500).SendString("Error retrieving todos!")
		}
		if(len(todos)==0){
			return c.Status(404).SendString("Todos not found");
		}
		return c.JSON(todos)
	})

	log.Fatal(app.Listen(":4000"))
}