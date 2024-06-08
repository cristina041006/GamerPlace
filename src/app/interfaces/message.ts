//Interfaz para recibir los mensajes de la base de datos
export interface Message {
    idMessage: number,
    user: string,
    content: string,
    date: Date
}

//Interfaz para mandar un mensaje
export interface MessageSend {
    user: string,
    content: string,
    date: Date
}