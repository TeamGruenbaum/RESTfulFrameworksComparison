package datatransferobjects

type UpdateBook struct {
	Isbn   string `json:"isbn" binding:"omitempty,isbn"`
	Title  string `json:"title" binding:"omitempty,min=0,max=300"`
	Author string `json:"author" binding:"omitempty,min=0,max=300"`
}
