
/**
 * Interfaz con todos los datos necesarios del pageable
 */
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

/**
 * Intergfaz de videojuego con todos sus datos
 */
export interface Videogame {
    idVideogame?:   number;
    name:          string;
    description:   string;
    price:         number;
    stock:         number;
    quality:       string;
    idPlataform:   number;
    namePlataform: string;
    idUser:        number;
    username:      string;
    image:         string;
    listCategory:  ListCategoryGame[];
}


/**
 * Interfaz de gameCatgeory
 */
export interface ListCategoryGame {
    idGame:       number;
    nameGame:     string;
    idCategory:   number;
    nameCategory: string;
}

/**
 * Interfaz con los datos basicos del pageable
 */
export interface Pageable {
    pageNumber: number;
    pageSize:   number;
    sort:       Sort;
    offset:     number;
    unpaged:    boolean;
    paged:      boolean;
}

/**
 * Interfaz para saber si el pageable esta ordenado
 */
export interface Sort {
    empty:    boolean;
    sorted:   boolean;
    unsorted: boolean;
}