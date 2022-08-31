const { response, json} = require('express');
const bcryptjs = require('bcryptjs');

const { generarJWT }= require('../helpers/generar-jwt');

const Usuario = require('../models/usuario');

const { googleVerify } = require('../helpers/google-verify');

const login = async ( req, res = response) => {

    const { correo, password }= req.body;


    try {
        
        //Verificar si el email existe
        const usuario = await Usuario.findOne({correo});

        if (!usuario){

            return res.status(400).json({

                msg : 'Usuario / Password no son correctos - correo',
            })
        }

        // Si el usuario está activo
        if ( !usuario.estado){

            return res.status(400).json({

                msg : 'Usuario / Password no son correctos - estado : false',
            })
        }

        //Verificar la contraseña 

        const validPass = bcryptjs.compareSync( password, usuario.password );

        if (!validPass){
            return res.status(400).json({

                msg : 'Usuario / Password no son correctos - contraseña',
            })

        }
        //Generar el JWT

        const token = await generarJWT( usuario.id);
       
        res.json({

            msg : 'Login ok',
            usuario,
            token
    
        })
    
    } catch (error) {

        console.log(error)

        res.status(500).json({

            msg : 'Hable con el administrador',
           
        })
    
    }
}

const googleSignIn = async ( req, res = response ) =>{

    const {id_token} = req.body;


    try {
        

        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne( { correo } );
        

        if( !usuario ) {

            
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: "USER_ROLE",
                google: true

            }
            
            usuario =  new Usuario( data );
            await usuario.save();
        }

        if( !usuario.estado ) {
            return res.status(401).json({

                msg : 'Hable con el adminsitrador, usuario inactivo'
            });
        }

        const token = await generarJWT( usuario.id);
        
        // console.log(googleUser)

        res.json({
    
            msg :'Todo esta bien! Google Sing-In',
            usuario,
            token
        })

    } catch (error) {

        res.status(400).json({

                ok:false,
                msg: 'El Token no se pudo verificar'
        })
    }

}

module.exports = {

        login,
        googleSignIn
}