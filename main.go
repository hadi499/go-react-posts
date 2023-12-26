package main

import (
	"go-lat/config"
	"go-lat/controllers"

	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDatabase()
	db := config.DB
	imageController := &controllers.ImageController{DB: db}

	r := gin.Default()
	r.Static("/uploads", "./uploads")
	r.GET("/api/posts", controllers.Index)
	r.POST("/api/posts/create", imageController.Create)
	r.GET("/api/posts/:id", controllers.Detail)
	r.DELETE("/api/posts/:id", imageController.Delete)
	r.PATCH("/api/posts/:id", imageController.Update)

	r.POST("/api/users/register", controllers.Register)
	r.POST("/api/users/login", controllers.Login)
	r.POST("/api/users/logout", controllers.Logout)
	r.GET("/api/users/profile", controllers.Profile)

	r.Run() // listen and serve on 0.0.0.0:8080
}
