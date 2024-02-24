/**Interfaz para el loguin del usuario */
export interface UserLogin {
    username: string,
    password: string
}

/**Interfaz para el usuario registrado */
export interface User  {
    username: string,
    email:string,
    name:string,
    adderess:string,
    phone:string,
    password:string,
    image:string
}