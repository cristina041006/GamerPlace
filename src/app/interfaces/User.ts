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

/**Interfaz para los usuarios que se van a listar */
export interface UserGetList {
    username: string,
    email:    string,
    rol:      string,
    image:    string,
    deleteUser: string
}

/**Interfaz de combina los atributos de user y de userLogin */
export interface UserWithLogin {
    username:   string;
    email:      string;
    name:       string;
    address:    string;
    phone:      string;
    rol:        string;
    image:      null;
    deleteUser: string;
}
export interface UserEdit {

    username: string,
    email: string,
    name: string,
    address:string,
    phone: string,
    password: string,
    image: string
}

export interface UserPasswordEdit{
    username: string,
    oldPassword: string,
    newPassword: string
}


