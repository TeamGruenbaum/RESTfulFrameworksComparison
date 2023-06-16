package datatransferobjects

type CreateBook struct {
	Isbn   string `json:"isbn" binding:"required,isbn"`
	Title  string `json:"title" binding:"required,min=1,max=300"`
	Author string `json:"author" binding:"required,min=1,max=300"`
}
