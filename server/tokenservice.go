package main

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
)

type UserClaims struct {
	Id string `json:"id"`
	First string `json:"fistname"`
	Last string `json:"lastname"`
	jwt.StandardClaims
}

var secretKey = []byte("secret-key")

func CreateToken(username string) (string,error){
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"username": username,
			"exp": time.Now().Add(time.Hour * 24).Unix(),
		})
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "",err
	}
	return tokenString, nil
}

func VerifyToken(tokenString string) error{
	token,err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error){
		return secretKey, nil
	})
	if err != nil{
		return err
	}
	if !token.Valid{
		return fmt.Errorf("invalid token")
	}
	return nil
}

func AuthMiddleware(c *fiber.Ctx) error{
	//Lấy token từ header authorization
	authHeader := c.Get("Authorization")
	if authHeader == ""{
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Missing authorization header",
		})
	}

	//Loại bỏ prefix Bearer
	tokenString := strings.TrimSpace(authHeader[len("Bearer "):])
	print(tokenString)
	//Xác thực token
	err := VerifyToken(tokenString)
	if err != nil{
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token",
		})
	}
	//Tiếp tục xử lý nếu token hợp lệ
	return c.Next()
}

func NewAccessToken(claims UserClaims) (string,error){
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256,claims)

	return accessToken.SignedString([]byte(os.Getenv("TOKEN_SECRET")))
}

func NewRefreshToken(claims jwt.StandardClaims) (string,error){
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256,claims)

	return refreshToken.SignedString([]byte(os.Getenv("TOKEN_SECRET")))
}

func ParseAccessToken(accessToken string) *UserClaims{
	parsedAccessToken,_ := jwt.ParseWithClaims(accessToken, &UserClaims{}, func(token *jwt.Token) (interface{},error){
		return []byte(os.Getenv("TOKEN_SECRET")),nil
	})
	return parsedAccessToken.Claims.(*UserClaims)
}

func ParseRefreshToken(refreshToken string) *jwt.StandardClaims{
	parsedRefreshToken,_ := jwt.ParseWithClaims(refreshToken,&jwt.StandardClaims{}, func(token *jwt.Token) (interface{},error) {
		return []byte(os.Getenv("TOKEN_SECRET")),nil
	})
	return parsedRefreshToken.Claims.(*jwt.StandardClaims)
}