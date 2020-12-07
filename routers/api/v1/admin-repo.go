package v1

import (
	// "log"
	// "fmt"
	"fmt"
	"net/http"

	"github.com/astaxie/beego/validation"
	"github.com/gin-gonic/gin"
	"github.com/unknwon/com"

	"gitlib/models"
	"gitlib/pkg/setting"
)

// GetPage conver page number to page start index, start from 0
// because mysql offset of first row is 0
// case:
// page = 1, pagesize = 3, pageStartIndex = 0
// page = 2, pagesize = 3, pageStartIndex = 3
func GetPageStartIdx(c *gin.Context) int {
	pageStartIndex := 0
	page, _ := com.StrTo(c.Query("page")).Int()
	if page > 0 {
		pageStartIndex = (page - 1) * setting.PageSize
	}
	return pageStartIndex
}


func AdminListRepos(c *gin.Context) {
	fmt.Printf("in AdminListRepos\n")
	data := make(map[string]interface{})
	data["repo_list"] = models.ListRepos(GetPageStartIdx(c), setting.PageSize, make(map[string]interface{}))
	c.JSON(http.StatusOK, data)
}


func AdminAddRepo(c *gin.Context) {
	name := c.PostForm("name")
	url := c.PostForm("url")
	createdBy := "admin_leo"

	valid := validation.Validation{}
	valid.Required(name, "name").Message("name is required")
	valid.MaxSize(name, 255, "name").Message("name max length is 255")
	valid.Required(url, "url").Message("url is required")
	valid.MaxSize(url, 1024, "url").Message("url max length is 1024")

	if valid.HasErrors() {
		c.JSON(http.StatusBadRequest, valid.Errors)
		return
	}

	if models.ExistRepoByName(name) {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": fmt.Sprintf("repo %v exists", name),
		})
		return
	}

	repo := models.AddRepo(name, url, createdBy)
	c.JSON(http.StatusOK, repo)
}

func AdminUpdateRepo(c *gin.Context) {
	id := com.StrTo(c.Param("id")).MustInt()
	name := c.PostForm("name")
	url := c.PostForm("url")
	modifiedBy := "admin_leo"

	valid := validation.Validation{}
	valid.Min(id, 0, "id").Message("id must greater than 0")
	valid.MaxSize(name, 255, "name").Message("name max length is 255")
	valid.MaxSize(url, 1024, "url").Message("url max length is 1024")

	if valid.HasErrors() {
		c.JSON(http.StatusBadRequest, valid.Errors)
		return
	}

	if name == "" && url == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": fmt.Sprintf("params invalid"),
		})
		return
	}

	if !models.ExistRepoByID(id) {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": fmt.Sprintf("repo %v does not exist", id),
		})
		return
	}

	// name can be same with repo repo
	// but cannot be same with other repo
	// repoWithName.ID > 0     ==> there is a repo with given name
	// repoWithName.ID != id   ==> and this repo is not target repo
	repoWithName := models.GetRepoByName(name)
	if repoWithName.ID > 0 && repoWithName.ID != id {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": fmt.Sprintf("repo %v exists", name),
		})
		return
	}


	data := make(map[string]interface{})
	data["modified_by"] = modifiedBy
	if name != "" {
		data["name"] = name
	}
	if url != "" {
		data["url"] = url
	}

	models.UpdateRepoByID(id, data)
	c.JSON(http.StatusOK, data)
}

func AdminDeleteRepo(c *gin.Context) {
	id := com.StrTo(c.Param("id")).MustInt()

	valid := validation.Validation{}
	valid.Min(id, 0, "id").Message("id must greater than 0")

	if valid.HasErrors() {
		c.JSON(http.StatusBadRequest, valid.Errors)
		return
	}

	if !models.ExistRepoByID(id) {
		c.JSON(http.StatusOK, gin.H{
			"message": true,
		})
		return
	}

	models.DeleteRepoByID(id)
	c.JSON(http.StatusOK, gin.H{
		"message": true,
	})
}
