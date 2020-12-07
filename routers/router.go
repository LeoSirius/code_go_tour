package routers

import (
	// "fmt"
	// "os"
	// "net/http"
	// "strings"

	"fmt"
	"net/http"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"

	// "github.com/gin-contrib/logger"
	// "github.com/rs/zerolog"
	// "github.com/rs/zerolog/log"

	"gitlib/pkg/setting"
	"gitlib/routers/api/v1"
)

const (
	userkey = "user"
)

// InitRouter init urls
func InitRouter() *gin.Engine {
	gin.SetMode(setting.RunMode)
	r := gin.New()

	r.Use(gin.Recovery())
	r.Use(gin.Logger())
	r.Use(cors.Default())

	store := cookie.NewStore([]byte("secret"))
	r.Use(sessions.Sessions("mysession", store))
	// r.Use(static.Serve("/", static.LocalFile("./frontend/build", true)))
	// // r.Use(static.Serve("/admin", static.LocalFile("./frontend/build", true)))
	// r.Use(static.Serve("/admin", static.LocalFile("./frontend/build", true)))
	// r.StaticFile("/", "./frontend/build")
	// r.LoadHTMLGlob("frontend/build/index.html")
	// r.LoadHTMLGlob("frontend/build/index.html")
	homeView := r.Group("/")
	homeView.Use(static.Serve("/", static.LocalFile("./frontend/build", true)))
	{
		homeView.GET("/", func(c *gin.Context) {})  // fake view
		homeView.GET("/login", loginGET)
	}

	adminView := r.Group("/admin")
	adminView.Use(static.Serve("/admin", static.LocalFile("./frontend/build", true)))
	adminView.Use(AuthRequired)
	{
		adminView.GET("/", func(c *gin.Context) {})
	}
	// r.GET("/admin", func(c *gin.Context) {
	// 	session := sessions.Default(c)
	// 	user := session.Get(userkey)
	// 	fmt.Printf("in AuthRequired")
	
	// 	if user == nil {
	// 		// c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
	// 		// 	"error": "unauthorized",
	// 		// })
	// 		c.Redirect(http.StatusFound, "/login")
	// 		return
	// 	}
	// 	c.HTML(http.StatusOK, "./frontend/build/index.html", "")
	// })
	r.Static("/static", "./frontend/build/static")
	// staticAdminServe := static.Serve("/admin", static.LocalFile("./frontend/build", true))
	// staticAdminServeGroup := r.Group("/", staticAdminServe)
	// staticAdminServeGroup.Use(AuthRequired)

	r.LoadHTMLGlob("templates/*")

	
	r.POST("/login", loginPOST)
	r.GET("/logout", logout)
	// admin := r.Group("/admin")
	// admin.Use(AuthRequired)
	// {
	// 	admin.GET("/me", me)
	// 	admin.GET("/status", status)
	// }

	apiv1admin := r.Group("/api/v1/admin")
	apiv1admin.Use(APIAdminAuthRequired)
	{
		apiv1admin.GET("/repos", v1.AdminListRepos)
		apiv1admin.POST("/repos", v1.AdminAddRepo)
		apiv1admin.PUT("/repos/:id", v1.AdminUpdateRepo)
		apiv1admin.DELETE("/repos/:id", v1.AdminDeleteRepo)
	}

	apiv1 := r.Group("/api/v1")
	{
		apiv1.GET("/repos", v1.ListRepos)
		apiv1.GET("/repos/:id/dirent-tree", v1.GetRepoDirentTree)
		apiv1.GET("/repos/:id/file", v1.GetRepoFile)
	}

	r.GET("/test", func(c *gin.Context) {

		c.JSON(200, gin.H{
			"message": "test",
		})
	})


	return r
}

func APIAdminAuthRequired(c *gin.Context) {
	session := sessions.Default(c)
	user := session.Get(userkey)
	fmt.Printf("in AuthRequired")
	
	if user == nil {
		// c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
		// 	"error": "unauthorized",
		// })
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "unauthorized",
		})
		return
	}
	c.Next()
}

func AuthRequired(c *gin.Context) {
	session := sessions.Default(c)
	user := session.Get(userkey)
	fmt.Printf("in AuthRequired")

	if user == nil {
		// c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
		// 	"error": "unauthorized",
		// })
		c.Redirect(http.StatusFound, "/login")
		return
	}
	c.Next()
}

func loginGET(c *gin.Context) {
	c.HTML(http.StatusOK, "login.html", "")
	return
}

func loginPOST(c *gin.Context) {

	session := sessions.Default(c)
	username := c.PostForm("username")
	password := c.PostForm("password")

	if strings.Trim(username, " ") == "" || strings.Trim(password, " ") == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "parameters cannot be empty",
		})
		return
	}

	if username != "leo" || password != "z13547842355" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "authentification failed",
		})
		return
	}

	session.Set(userkey, username)
	if err := session.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to save session",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "user authentified",
	})
}

func logout (c *gin.Context) {
	session := sessions.Default(c)
	user := session.Get(userkey)
	if user == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid session token",
		})
		return
	}
	session.Delete(userkey)
	if err := session.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to save session",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully logged out"})
}

func me(c *gin.Context) {
	session := sessions.Default(c)
	user := session.Get(userkey)
	c.JSON(http.StatusOK, gin.H{"user": user})
}

func status(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "You are logged in"})
}
