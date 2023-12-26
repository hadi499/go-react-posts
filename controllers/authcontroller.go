package controllers

import (
	"go-lat/config"
	"go-lat/helper"

	"go-lat/models"
	"net/http"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var validate *validator.Validate

func init() {
	validate = validator.New()
}
func isEmailUnique(email string) bool {
	var user models.User
	result := config.DB.Where("email = ?", email).First(&user)
	return result.Error == gorm.ErrRecordNotFound
}

func Register(c *gin.Context) {

	var user models.User

	// Decode the JSON request body into the User struct
	if err := c.ShouldBindJSON(&user); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	// Validate the User struct
	//  validate.Struct(user); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Validation error: %v", err)})
	// 	return
	// }

	if _, err := govalidator.ValidateStruct(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		// errs := err.(govalidator.Errors).Errors()
		// for _, e := range errs {
		// 	c.JSON(http.StatusBadRequest, gin.H{"error": e.Error()})
		// }

		return
	}

	// email := user.Email
	// if govalidator.IsEmail(email) {
	// 	// hash pass menggunakan bcrypt
	// 	hashPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	// 	user.Password = string(hashPassword)
	// 	config.DB.Create(&user)
	// 	c.JSON(http.StatusOK, gin.H{"message": "register berhasil"})
	// } else {
	// 	c.JSON(http.StatusBadRequest, gin.H{"message": "email salah"})
	// }

	if !isEmailUnique(user.Email) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email is already in use"})
		return
	}
	hashPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hashPassword)
	config.DB.Create(&user)
	c.JSON(http.StatusOK, gin.H{"message": "register berhasil"})

}

func Login(c *gin.Context) {
	var userInput models.User

	if err := c.ShouldBindJSON(&userInput); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	var user models.User
	if err := config.DB.Where("email = ?", userInput.Email).First(&user).Error; err != nil {
		switch err {
		case gorm.ErrRecordNotFound:
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	// cek apakah password valid
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userInput.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// proses pembuatan token jwt
	expTime := time.Now().Add(time.Minute * 1)
	claims := &helper.JWTClaim{
		Username: user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "go-rest-api",
			ExpiresAt: jwt.NewNumericDate(expTime),
		},
	}

	// medeklarasikan algoritma yang akan digunakan untuk signing
	tokenAlgo := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// signed token
	token, err := tokenAlgo.SignedString(helper.JWT_KEY)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// set token yang ke cookie
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "token",
		Path:     "/",
		Value:    token,
		HttpOnly: true,
	})

	c.JSON(http.StatusOK, gin.H{"id": user.Id, "email": user.Email, "username": user.Username})
}

func Logout(c *gin.Context) {
	// hapus token yang ada di cookie
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "token",
		Path:     "/",
		Value:    "",
		HttpOnly: true,
		MaxAge:   -1,
	})

	c.JSON(http.StatusOK, gin.H{"message": "logout berhasil"})
}

func Profile(c *gin.Context) {
	var users []models.User
	config.DB.Preload("Posts").Find(&users)

	c.JSON(http.StatusOK, gin.H{"users": users})

}
