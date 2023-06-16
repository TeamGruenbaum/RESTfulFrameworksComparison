package datatransferobjects

type GetAllBooks struct {
	Page     int    `form:"page" binding:"required,min=1"`
	Per_Page int    `form:"per_page" binding:"required,min=1,max=50"`
	Query    string `form:"query" binding:"min=0,max=30"`
}
