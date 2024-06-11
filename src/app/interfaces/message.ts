//Interfaz para recibir los mensajes de la base de datos
export interface Message {
    idMessage: number,
    user: string,
    content: string,
    date: Date,
    status: string
}

//Interfaz para mandar un mensaje
export interface MessageSend {
    user: string,
    content: string,
}

export interface MessageEdit{
    idMessage: number,
	user: string,
	content: string
}