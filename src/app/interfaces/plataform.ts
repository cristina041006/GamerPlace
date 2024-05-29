/**
 * Interfaz de platafromas sin su lista de games
 */
export interface PlataformWithoutList {
    idPlataform: number;
    name:        string;
    listGame:    null;
}

/**
 * Interfaz para añadir una plataforma
 */
export interface AddPlataform {
    name: string
}