export interface Message {
    idMessage: number,
    user: string,
    content: string,
    date: Date
}

export interface MessageSend {
    user: string,
    content: string,
    date: Date
}