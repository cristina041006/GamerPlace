/**Interfaz para un gameBill que se va a almacenar en la cesta */
export interface GameBill {
    idVideogame: number,
    nameVideogame:string,
    amount: number
    price: number,
    maxStock: number,
    quality: string
}

/**Interfaz para un gameBill que vamos a comprar */
export interface GameBillBuy {
    idVideogame: number,
    nameVideogame:string,
    amount: number,
    quality: string

}

/**Interfaz para una factura */
export interface Bill{
    idBill: number,
    username: number,
    totalPrice: number,
    date: Date,
    listGameBill: ListGameBill[] 
}

/**Interfaz para el gameBill que esta en la factura */
export interface ListGameBill {
    idVideogame: number,
    nameVideogame:string,
    idBill: number,
    amount: number,
    price: number
   
}

/**Pageable de factura */
export interface ListPageableBill {
    content:          Bill[];
    pageable:         Pageable;
    last:             boolean;
    totalPages:       number;
    totalElements:    number;
    size:             number;
    number:           number;
    sort:             Sort;
    first:            boolean;
    numberOfElements: number;
    empty:            boolean;
}

/**Atributos del pagebale */
export interface Pageable {
    pageNumber: number;
    pageSize:   number;
    sort:       Sort;
    offset:     number;
    unpaged:    boolean;
    paged:      boolean;
}

/**Orden del pageable */
export interface Sort {
    empty:    boolean;
    sorted:   boolean;
    unsorted: boolean;
}