package v1

import (
	"fmt"
	"io/ioutil"
	// "log"
	"net/http"
	"path/filepath"
	"os"
	"bufio"
	"strings"

	// "github.com/astaxie/beego/validation"
	"github.com/astaxie/beego/validation"
	"github.com/gin-gonic/gin"
	"github.com/unknwon/com"

	"gitlib/models"
	"gitlib/pkg/setting"
)

const (
	LIB_BASE_PATH = "/root/Github"
)
func ListRepos(c *gin.Context) {
	data := make(map[string]interface{})
	data["repo_list"] = models.ListRepos(GetPageStartIdx(c), setting.PageSize, make(map[string]interface{}))
	c.JSON(http.StatusOK, data)
}

type Dirent struct {
	Name string `json:"name"`
	Size int64 `json:"size"`
	IsDir bool `json:"is_dir"`
	PathInRepo string `json:"path_in_repo"`
	Children []Dirent `json:"children"`
}

type TOCItem struct {
	Name string `json:"name"`
	Level int `json:"level"`
}


func GetDirentTree(sysPath, pathInRepo string) ([]Dirent, error) {
	dirents := []Dirent{}
	files, err := ioutil.ReadDir(sysPath)
	if err != nil {
		return dirents, err
	}

	for _, fileInfo := range files {
		newSysPath := filepath.Join(sysPath, fileInfo.Name())
		newPathInRepo := filepath.Join(pathInRepo, fileInfo.Name())
		children := []Dirent{}
		if fileInfo.IsDir() {
			children, err = GetDirentTree(newSysPath, newPathInRepo)
		}
		if err != nil {
			return dirents, err
		}

		dirent := Dirent{
			Name: fileInfo.Name(),
			Size: fileInfo.Size(),
			IsDir: fileInfo.IsDir(),
			PathInRepo: newPathInRepo,
			Children: children,
		}
		// fmt.Printf("dirent = %+v\n", dirent)
		dirents = append(dirents, dirent)
	}
	return dirents, nil
}

// ListRepoDirents returns dirents of a repo by parent_path
// parent_path is relative to LIB_BASE_PATH/repo_name
// if parent_path == '/', then parent_path is LIB_BASE_PATH/repo_name it self
func GetRepoDirentTree(c *gin.Context) {
	id := com.StrTo(c.Param("id")).MustInt()
	// parentPath := c.Query("parent_path")
	// fmt.Printf("parentPath = %v\n", parentPath)

	valid := &validation.Validation{}
	valid.Min(id, 0, "id").Message("id must greater than 0")


	if valid.HasErrors() {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": c.Errors,
		})
		return
	}

	repo := models.GetRepoByID(id)
	if repo.ID <= 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"message": fmt.Sprintf("repo %v not found", id),
		})
		return
	}

	sysPath := filepath.Join(LIB_BASE_PATH, repo.Name)
	pathInRepo := ""
	direntTree, err := GetDirentTree(sysPath, pathInRepo)
    if err != nil {
		fmt.Printf("readir failed dir:%+v, err: %+v\n", sysPath, err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal Server Error",
		})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"dirent_tree": direntTree,
	})
}

func GetRepoFile(c *gin.Context) {
	id := com.StrTo(c.Param("id")).MustInt()
	path := c.Query("path")         // path is path in repo
	fmt.Printf("path = '%v'\n", path)

	valid := &validation.Validation{}
	valid.Min(id, 0, "id").Message("id must greater than 0")

	if path == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "path invalid",
		})
		return
	}

	if valid.HasErrors() {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": c.Errors,
		})
		return
	}

	repo := models.GetRepoByID(id)
	if repo.ID <= 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"message": fmt.Sprintf("repo %v not found", id),
		})
		return
	}

	sysPath := filepath.Join(LIB_BASE_PATH, repo.Name, path)
	fileBytes, err := ioutil.ReadFile(sysPath)
	if err != nil {
		fmt.Printf("readfile failed dir:%+v, err: %+v\n", sysPath, err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal Server Error",
		})
		return
	}

	file, err := os.Open(sysPath)
	if err != nil {
		fmt.Printf("open file failed dir:%+v, err: %+v\n", sysPath, err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal Server Error",
		})
		return
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)

	toc := []TOCItem{}
	isInCode := false
	for scanner.Scan() {
		curLine := scanner.Text()

		if strings.HasPrefix(curLine, "```") && !isInCode {
			isInCode = true
			continue
		}
		if strings.HasPrefix(curLine, "```") && isInCode {
			isInCode = false
			continue
		}
		if isInCode {
			continue
		}
		if !strings.HasPrefix(curLine, "#") {
			continue;
		}

		tocItem := TOCItem{}
		if strings.HasPrefix(curLine, "#####") {
			name := strings.Trim(strings.Trim(curLine, "#"), " ")
			tocItem.Name = name
			tocItem.Level = 5

		} else if strings.HasPrefix(curLine, "####") {
			name := strings.Trim(strings.Trim(curLine, "#"), " ")
			tocItem.Name = name
			tocItem.Level = 4

		} else if strings.HasPrefix(curLine, "###") {
			name := strings.Trim(strings.Trim(curLine, "#"), " ")
			tocItem.Name = name
			tocItem.Level = 3

		} else if strings.HasPrefix(curLine, "##") {
			name := strings.Trim(strings.Trim(curLine, "#"), " ")
			tocItem.Name = name
			tocItem.Level = 2

		} else if strings.HasPrefix(curLine, "#") {
			name := strings.Trim(strings.Trim(curLine, "#"), " ")
			tocItem.Name = name
			tocItem.Level = 1
		}
		toc = append(toc, tocItem)
	}
	

	c.JSON(http.StatusOK, gin.H{
		"content": string(fileBytes),
		"toc": toc,
	})

}