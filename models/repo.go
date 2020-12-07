package models

import (
	// "fmt"
	"fmt"
	"time"

	"gorm.io/gorm"
)

// CREATE TABLE `gitlib_repo` (
// 	`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
// 	`name` varchar(255) DEFAULT '',
// 	`url` varchar(1024) DEFAULT '',
// 	`created_at` int(10) unsigned DEFAULT '0',
// 	`created_by` varchar(255) DEFAULT '',
// 	`modified_at` int(10) unsigned DEFAULT '0',
// 	`modified_by` varchar(255) DEFAULT '',
// 	PRIMARY KEY (`id`)
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

type Repo struct {
	Model

	Name string `json:"name"`				// unique in code level
	URL string `json:"url"`
	CreatedBy string `json:"created_by"`
	ModifiedBy string `json:"modifited_by"`
}

func GetRepoByName(name string) (repo Repo) {
	db.Where("name = ?", name).First(&repo)
	return
}

func GetRepoByID(ID int) (repo Repo) {
	db.Where("id = ?", ID).First(&repo)
	return
}

func ExistRepoByIDAndName(ID int, name string) bool {
	var repo Repo
	db.Where("ID = ? and name = ?", ID, name).First(&repo)
	if repo.ID > 0 {
		return true
	}
	return false
}

func ExistRepoByName(name string) bool {
	var repo Repo
	db.Where("name = ?", name).First(&repo)
	if repo.ID > 0 {
		return true
	}
	return false
}

func ExistRepoByID(ID int) bool {
	var repo Repo
	db.Where("ID = ?", ID).First(&repo)
	if repo.ID > 0 {
		return true
	}
	return false
}

func ListRepos(pageNum int, pageSize int, maps interface{}) (repos []Repo) {
	db.Where(maps).Offset(pageNum).Limit(pageSize).Find(&repos)
	return
}

func AddRepo(name, url, created_by string) (repo Repo) {
	repo = Repo{
		Name: name,
		URL: url,
		CreatedBy: created_by,
	}
	db.Create(&repo)
	return
}

func UpdateRepoByID(ID int, data map[string]interface{}) {
	fmt.Printf("update repo data = %+v\n", data)
	db.Model(&Repo{}).Where("id = ?", ID).Updates(data)
}

func DeleteRepoByID(ID int) {
	db.Where("id = ?", ID).Delete(&Repo{})
}

// func GetTagTotal(maps interface{}) (count int) {
// 	db.Model(&Tag{}).Where(maps).Count(&count)

// 	return
// }

// func ExistTagByName(name string) bool {
// 	var tag Tag
// 	db.Select("id").Where("name = ?", name).First(&tag)
// 	if tag.ID > 0 {
// 		return true
// 	}
// 	return false
// }

// func ExistTagById(id int) bool {
// 	var tag Tag
// 	db.Select("id").Where("id = ?", id).First(&tag)
// 	if tag.ID > 0 {
// 		return true
// 	}
// 	return false
// }


// func AddTag(name string, state int, createdBy string) bool {
// 	db.Create(&Tag {
// 		Name: name,
// 		State: state,
// 		CreatedBy: createdBy,
// 	})

// 	return true
// }

// func DeleteTag(id int) bool {
// 	db.Where("id = ?", id).Delete(&Tag{})
// 	return true
// }

// func EditTag(id int, data interface {}) bool {
// 	db.Model(&Tag{}).Where("id = ?", id).Updates(data)
// 	return true
// }


// callbacks

func (repo *Repo) BeforeCreate(db *gorm.DB) (err error) {
	db.Statement.SetColumn("CreatedAt", time.Now().Unix())
	return
}

func (repo *Repo) BeforeUpdate(db *gorm.DB) (err error){
	db.Statement.SetColumn("ModifiedAt", time.Now().Unix())
	fmt.Printf(" in in BeforeUpdate, repo.ModifiedAt = %v\n", repo.ModifiedAt)
	return
}
