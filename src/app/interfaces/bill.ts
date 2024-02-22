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

interface ListGameBill {
    idVideogame: number,
    nameVideogame:string,
    idBill: number,
    amount: number
   
}