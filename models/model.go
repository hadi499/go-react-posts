package models

import "time"

type Post struct {
	Id        int64  `gorm:"primaryKey" json:"id"`
	Title     string `gorm:"type:varchar(255)" json:"title"`
	Content   string `gorm:"type:text" json:"content"`
	Image     string `gorm:"type:varchar(255)" json:"image"`
	UserId    int64  `json:"user_id"`
	User      User   `gorm:"foreignKey:UserId" json:"user"` // Relasi Many-to-One
	CreatedAt time.Time
	UpdatedAt time.Time
}

type User struct {
	Id       int64  `gorm:"primaryKey" json:"id" `
	Username string `gorm:"type:varchar(255)" json:"username" valid:"required~username required"`
	Email    string `gorm:"varchar(100)" json:"email" valid:"required,email~email required"`
	Password string `gorm:"type:varchar(255)" json:"password" valid:"required~password required"`
	// Posts     []Post `json:"posts"` // Relasi One-to-Many
	CreatedAt time.Time
	UpdatedAt time.Time
}
