const sharp = require("sharp");

const { body, validationResult } = require('express-validator');
const db = require("../database");
const Diagram = db.diagram;
const Collaboration = db.collaboration;
const { pagination, handleExceptions } = require('../helpers');
const fs = require('fs');
const path = require('path');

const UPLOADS_FOLDER = '../public/uploads/'
const FILES_PATH = 'files/'

module.exports = {

    getAll: {
        handler: async (req, res) => {

            try {

                const {limit, offset, page} = pagination(req);
                const user_id = req.user_id;
    
                // Busca e conta todos os registros passando os dados para paginação
                const diagrams = await Diagram.scope({ method: ['byUser', user_id] }).findAndCountAll({
                    limit,
                    offset,
                    order: [['id', 'DESC']] //Mais recentes primeiro
                });

                let result = diagrams.rows.map(item => ({...item.dataValues, diagram_svg: FILES_PATH+item.diagram_svg}));

                return res.json({diagrams: result, pagination: {limit, page: page+1, total: diagrams.count}});
    
            } catch (error) {
                return handleExceptions(error, res);
            }
            
        }
    },

    getAllShared: {
        handler: async (req, res) => {

            try {

                const user_id = req.user_id;
    
                // Busca e conta todos os registros passando os dados para paginação
                const diagrams = await Diagram.findAll({
                    where: {
                        '$collaboration.collaborator_id$': user_id
                    },
                    include: [{
                        model: Collaboration,
                        as: 'collaboration',
                        required: true
                    }],
                    order: [['id', 'DESC']] //Mais recentes primeiro
                });

                let result = diagrams.map(item => ({...item.dataValues, diagram_svg: FILES_PATH+item.diagram_svg}));

                return res.json({diagrams: result});
    
            } catch (error) {
                return handleExceptions(error, res);
            }
            
        }
    },

    get: {
        handler: async (req, res) => {

            try {
    
                const { id } = req.params;
                const user_id = req.user_id;
    
                const diagram = await Diagram.scope({ method: ['byOwnerOrCollaborator', user_id, Collaboration] }).findByPk(id);

                if (!diagram) { return res.status(404).json({errors: [{msg: "Diagrama não encontrado"}]}); }
    
                return res.json({...diagram.dataValues, diagram_svg: FILES_PATH+diagram.diagram_svg});
    
            } catch (error) {
                return handleExceptions(error, res);
            }
            
        }
    },

    create: {
        validations: [
            body('name').isLength({ min: 3, max: 255 }).withMessage("O nome deve ter entre 3 e 255 caracteres").not().isEmpty().withMessage("Preencha o campo nome")
        ], 
        handler: async (req, res) => {
            
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) 
                    throw {name: 'RequestValidationError', errors};

                const user_id = req.user_id;

                const { name, diagram_data, diagram_svg } = req.body;

                let file_name = Math.random().toString(36).slice(2, 12)+'.svg';
                
                if (diagram_svg) {
    
                    let file_err = fs.writeFile(path.join(__dirname, UPLOADS_FOLDER, file_name), diagram_svg,  function (err) {
                        return err
                    });
    
                    if (file_err) throw {name: 'FileWritingError', errors};

                }

                const diagram = await Diagram.create({ name, diagram_data, user_id, diagram_svg: diagram_svg ? file_name : ''});

                return res.json({...diagram.dataValues, diagram_svg: FILES_PATH+diagram.diagram_svg});

            } catch (error) {
                return handleExceptions(error, res);
            }
        }
    },

    rename: {
        validations: [
            body('name').isLength({ min: 3, max: 255 }).withMessage("O nome deve ter entre 3 e 255 caracteres").not().isEmpty().withMessage("Preencha o campo nome")
        ], 
        handler: async (req, res) => {
            
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) 
                    throw {name: 'RequestValidationError', errors};

                const user_id = req.user_id;
                const { id } = req.params;
                const { name } = req.body;

                const diagram = await Diagram.scope({ method: ['byOwnerOrCollaborator', user_id, Collaboration]}).findByPk(id); 

                if (!diagram)
                    return res.status(404).json({ errors: [{msg: "Diagrama não encontrado!"}] });

                diagram.update({ name }, { where: { id } });

                return res.json({...diagram.dataValues, diagram_svg: FILES_PATH+diagram.diagram_svg});

            } catch (error) {
                return handleExceptions(error, res);
            }
        }
    },

    update: {
        validations: [
            body('name').isLength({ min: 3, max: 255 }).withMessage("O nome deve ter entre 3 e 255 caracteres").not().isEmpty().withMessage("Preencha o campo nome")
        ], 
        handler: async (req, res) => {
            
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) 
                    throw {name: 'RequestValidationError', errors};

                const user_id = req.user_id;
                const { id } = req.params;
                const { name, diagram_data, diagram_svg } = req.body;

                const diagram = await Diagram.scope({ method: ['byOwnerOrCollaborator', user_id, Collaboration]}).findByPk(id); 

                if (!diagram)
                    return res.status(404).json({ errors: [{msg: "Diagrama não encontrado!"}] });
    
                let file_name = Math.random().toString(36).slice(2, 12)+'.svg';
                
                if (diagram_svg) {
                
                    if (fs.existsSync(path.join(__dirname, UPLOADS_FOLDER, diagram.diagram_svg)) && diagram.diagram_svg)
                        fs.unlinkSync(path.join(__dirname, UPLOADS_FOLDER, diagram.diagram_svg));

                    let file_err = fs.writeFile(path.join(__dirname, UPLOADS_FOLDER, file_name), diagram_svg,  function (err) {
                        return err
                    });
    
                    if (file_err) throw {name: 'FileWritingError', errors};
                }

                diagram.update({ name, diagram_data, diagram_svg: diagram_svg ? file_name : diagram.diagram_svg }, { where: { id } });

                return res.json({...diagram.dataValues, diagram_svg: FILES_PATH+diagram.diagram_svg});

            } catch (error) {
                return handleExceptions(error, res);
            }
        }
    },

    delete: {
        handler: async (req, res) => {
    
            try {
    
                const { id } = req.params;
                const user_id = req.user_id;

                const diagram = await Diagram.scope({ method: ['byUser', user_id] }).findByPk(id);
                if (diagram) {
                    diagram.destroy();
                    return res.status(204).send();
                }

                const collab = await Collaboration.findOne({where: {collaborator_id: user_id}});
                if (collab) {
                    collab.destroy();
                    return res.status(204).send();
                }

                return res.status(404).json({ errors: [{msg: "Diagrama não encontrado!"}] });
    
            } catch (error) {
                return handleExceptions(error, res);
            }
            
        }
    },

    export: {
        validations: [
            body('svg').not().isEmpty().withMessage("SVG é necessário!"),
            body("format").isInt({min: 1, max: 3}).withMessage("Formato inválido!")
        ], 
        handler: async (req, res) => {
            
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) 
                    throw {name: 'RequestValidationError', errors};

                const { svg, format } = req.body;

                const formats = ["png", "jpeg", "webp"];
                let data = null;

                let img_format = formats[format-1];

                switch(img_format){
                    case "png":
                        data = await sharp(Buffer.from(svg)).png().toBuffer();
                        break;
                    case "jpeg":
                        data = await sharp(Buffer.from(svg)).jpeg().toBuffer();
                        break;
                    case "webp":
                        data = await sharp(Buffer.from(svg)).webp().toBuffer();
                        break;
                    default:
                        return res.status(400).json({ errors: [{msg: "Formato inválido!"}] });
                }
                return res.json({img: data.toString("base64"), format: img_format});
                
            } catch (error) {
                return handleExceptions(error, res);
            }
        }
    }

}
