const { response, request  } = require('express');

const Usuario = require('../models/usuario');

const esAdminRole = ( req = request, res = response, next) => {

        if(!req.usuario) {

            return res.status(500).json({

                msg : 'Se queire verificar el rol sin validar el token primero'
            })
        }
        const { rol, nombre } = req.usuario;

        if (rol !== 'ADMIN_ROLE'){

            return res.status(401).json({

                msg : `${nombre} no tiene permisos de administrador `
            })
        }
        next();
}

const tieneRole = ( ...roles ) => {

    return ( req = request, res = response, next) => {
        
        if(!req.usuario) {

            return res.status(500).json({

                msg : 'Se queire verificar el rol sin validar el token primero'
            })
        }

        if( !roles.includes( req.usuario.rol) ){

            return res.status(401).json({
                msg :`El servicio requeire uno de estos roles ${roles}`
            })
        }

    next();
    }
}
module.exports = {

    esAdminRole,
    tieneRole
}