export interface GameBill {
    idVideogame: number,
    nameVideogame:string,
    amount: number
    price: number,
    maxStock: number
}

export interface GameBillBuy {
    idVideogame: number,
    nameVideogame:string,
    amount: number

}

export interface Bill{
    idBill: number,
    username: number,
    totalPrice: number,
    date: Date,
    listGameBill: ListGameBill[] 
}
export interface ListGameBill {
    idVideogame: number,
    nameVideogame:string,
    idBill: number,
    amount: number
   
}


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