package main

import (
	"fmt"
	"net/http"

	// "github.com/gin-gonic/gin"
	// "github.com/gin-gonic/contrib/static"


	"gitlib/routers"
	"gitlib/pkg/setting"

)

func main() {
	router := routers.InitRouter()

	server := &http.Server{
		Addr: fmt.Sprintf(":%d", setting.HTTPPort),
		Handler: router,
		ReadTimeout: setting.ReadTimeout,
		WriteTimeout: setting.WriteTimeout,
		MaxHeaderBytes: 1 << 20,			// 1mb
	}

	

	server.ListenAndServe()
	
}
