
export interface ListPageable {
    content:          Videogame[];
    pageable:         Pageable;
    last:             boolean;
    totalElements:    number;
    totalPages:       number;
    size:             number;
    number:           number;
    sort:             Sort;
    first:            boolean;
    numberOfElements: number;
    empty:            boolean;
}

export interface Videogame {
    idVideogame:   number;
    name:          string;
    description:   string;
    price:         number;
    stock:         number;
    quality:       Quality;
    idPlataform:   number;
    namePlataform: string;
    idUser:        number;
    username:      Username;
    image:         null;
    listCategory:  ListCategoryGame[];
}

export interface ListCategoryGame {
    idGame:       number;
    nameGame:     string;
    idCategory:   number;
    nameCategory: string;
}

export enum Quality {
    New = "new",
}

export enum Username {
    Empresa = "empresa",
}

export interface Pageable {
    pageNumber: number;
    pageSize:   number;
    sort:       Sort;
    offset:     number;
    unpaged:    boolean;
    paged:      boolean;
}

export interface Sort {
    empty:    boolean;
    sorted:   boolean;
    unsorted: boolean;
}