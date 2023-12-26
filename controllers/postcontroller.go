package controllers

import (
	"fmt"
	"go-lat/config"
	"go-lat/models"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ImageController struct {
	DB *gorm.DB
}

func Index(c *gin.Context) {
	var posts []models.Post
	config.DB.Preload("User").Find(&posts)

	c.JSON(http.StatusOK, gin.H{"posts": posts})

}

func (ic *ImageController) Create(c *gin.Context) {
	// var post models.Post
	// if err := c.ShouldBindJSON(&post); err != nil {
	// 	c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
	// 	return
	// }

	userId := c.PostForm("user_id")
	title := c.PostForm("title")
	content := c.PostForm("content")

	image, _ := c.FormFile("image")

	if image != nil {
		// mengambil eksitensi file
		splitFile := strings.Split(image.Filename, ".")
		ext := splitFile[len(splitFile)-1]
		nameNewImage := fmt.Sprintf("%s.%s", time.Now().Format("20060102150405"), ext)

		imagePath := filepath.Join("uploads", nameNewImage)
		if err := c.SaveUploadedFile(image, imagePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		}
		// imageUrl := "http://localhost:8080/uploads/" + nameNewImage

		id := userId
		inputId, _ := strconv.ParseInt(id, 10, 64)

		posting := models.Post{
			Title:   title,
			Content: content,
			Image:   nameNewImage,
			UserId:  inputId,
		}

		if err := ic.DB.Create(&posting).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file metadata"})
			return
		}
	} else {
		id := userId
		inputId, _ := strconv.ParseInt(id, 10, 64)
		posting := models.Post{
			Title:   title,
			Content: content,
			UserId:  inputId,
		}

		if err := ic.DB.Create(&posting).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file metadata"})
			return

		}
	}
	c.JSON(http.StatusOK, gin.H{"message": "create post berhasil"})

}

func Detail(c *gin.Context) {
	var post models.Post
	id := c.Param("id")

	if err := config.DB.First(&post, id).Error; err != nil {
		switch err {
		case gorm.ErrRecordNotFound:
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"message": "Data tidak ditemukan"})
			return
		default:
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
			return
		}
	}
	c.JSON(http.StatusOK, gin.H{"post": post})
}

func (cf *ImageController) Update(c *gin.Context) {

	title := c.PostForm("title")
	content := c.PostForm("content")

	id := c.Param("id")

	image, _ := c.FormFile("image")

	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// }

	var post models.Post

	// Retrieve the file metadata from the database
	err := cf.DB.Where("id = ?", id).First(&post).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	if image == nil {
		fileMetadata := models.Post{
			Title:   title,
			Content: content,
		}
		if config.DB.Model(&fileMetadata).Where("id = ?", id).Updates(&fileMetadata).RowsAffected == 0 {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "tidak dapat mengupdate product"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Data berhasil diperbarui"})

	} else {
		// Define the path of the file to be deleted
		filePath := filepath.Join("uploads", post.Image)

		// Delete the file from the server

		err = os.Remove(filePath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete file from upload folder"})
			return
		}

		// mengambil ekstensi file
		splitDots := strings.Split(image.Filename, ".")
		ext := splitDots[len(splitDots)-1]
		nameNewImage := fmt.Sprintf("%s.%s", time.Now().Format("20060102150405"), ext)
		imagePath := filepath.Join("uploads", nameNewImage)
		if err := c.SaveUploadedFile(image, imagePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}

		fileMetadata := models.Post{
			Title:   title,
			Content: content,
			Image:   nameNewImage,
		}
		if config.DB.Model(&fileMetadata).Where("id = ?", id).Updates(&fileMetadata).RowsAffected == 0 {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "tidak dapat mengupdate product"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Data berhasil diperbarui"})

	}

	// imageUrl := "http://localhost:8080/uploads/" + nameNewImage

}

func (cf *ImageController) Delete(c *gin.Context) {

	id := c.Param("id")
	var post models.Post
	// Retrieve the file metadata from the database
	err := cf.DB.Where("id = ?", id).First(&post).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}
	print(post.Image)
	filePath := filepath.Join("uploads", post.Image)
	if &post.Image == nil {
		config.DB.Delete(&post, id)
	} else {
		// Define the path of the file to be deleted

		// Delete the file from the server
		err = os.Remove(filePath)
		// if err != nil {
		// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete file from upload folder"})
		// 	return
		// }
		config.DB.Delete(&post, id)

	}

	c.JSON(http.StatusOK, gin.H{"message": "Data berhasil dihapus"})
}
