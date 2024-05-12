/**
 * Interfaz de catgeoria sin su lista de gameCatgeory
 */
export interface CategoryWithoutList {
    id_category:  number;
    name:         string;
    gameCategory: null;
}

export interface CategoryWithoutListSend {
    id_category:  number;
    name:         string;
}