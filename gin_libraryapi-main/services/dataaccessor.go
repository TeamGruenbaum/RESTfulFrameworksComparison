package services

type DataAccessor[Item any, Create any, Update any] interface {
	Create(element Create) (uint, error)
	Read(page uint, perPage uint, query string) (uint, *[]Item, error)
	ReadById(id uint) (*Item, error)
	Update(id uint, element Update) (bool, error)
	Delete(id uint) (bool, error)
}
