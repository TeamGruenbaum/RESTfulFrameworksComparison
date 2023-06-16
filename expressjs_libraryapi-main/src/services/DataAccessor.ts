export type DataAccessor<Item, Create, Update>={
    /**
     * @throws {UnknownError}
     */
    create(book:Create):Promise<number>

    /**
     * @throws {NotFoundError}
     */
    readById(id:number):Promise<Item>

    /**
     * @throws {UnknownError}
     */
    read(page:number, perPage:number, query?:string):Promise<[number, Item[]]>

    /**
     * @throws {NotFoundError}
     */
    update(id:number, element:Update):Promise<void>

    /**
     * @throws {NotFoundError}
     */
    delete(id:number):Promise<void>
}