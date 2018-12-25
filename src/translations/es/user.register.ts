/**
 * Register ES
 */
export const messages = {
    success: 'El proceso de registro de usuario se ha completado con éxito',
    emailSubject: 'Bienvenido',
    valid: {
        email: 'Correo electrónico válido y disponible',
        username: 'Nombre de Usuario válido y disponible',
    },
    error: {
        username: {
            availability: 'Nombre de usuario no disponible',
            empty: 'Nombre de usuario vacio',
            duplicated: 'Nombre de usuario duplicado',
            format: 'El nombre de usuario tiene un formáto inválido',
        },
        email: {
            availability: 'Correo electrónico no disponible',
            empty: 'Correo electrónico vacio',
            duplicated: 'Correo electrónico duplicado',
            format: 'El correo electrónico tiene un formáto inválido',
        },
    },
};