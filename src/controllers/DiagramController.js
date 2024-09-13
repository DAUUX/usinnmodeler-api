const sharp = require("sharp");
const SVGtoPDF = require('svg-to-pdfkit');
const PDFDocument = require('pdfkit');

const { body, validationResult } = require('express-validator');
const db = require("../database");
const Diagram = db.diagram;
const Collaboration = db.collaboration;
const Favorite = db.favorite;
const { pagination, handleExceptions } = require('../helpers');
const fs = require('fs');
const path = require('path');

const UPLOADS_FOLDER = process.env.APP_URL == 'http://localhost:3000' ? path.join(__dirname, "../public/uploads/") : process.env.RAILWAY_VOLUME_MOUNT_PATH + '/'
const FILES_PATH = 'files/'

module.exports = {

    getAll: {
        handler: async (req, res) => {

            try {
                const user_id = req.user_id;
                const limit = parseInt(req.query.limit); // Obter o limite do parâmetro de consulta, se fornecido
                const order = req.query.order || 'id'; // Obter a ordem do parâmetro de consulta, se fornecido, caso contrário, usar 'id'
                const direction = req.query.direction || 'DESC'; // Direção da ordenação, padrão para 'DESC'
    
                // Configuração consulta
                let queryOptions = {
                    order: [[order, direction]], // Ordenar pela ordem fornecida e direção
                    include: [{ model: Favorite, as: "favorite", where: { '$favorite.user_id$': user_id }, required: false }]
                };
    
                // Se o limite for fornecido, adicione
                if (limit) {
                    queryOptions.limit = limit;
                }
    
                // Busca e conta todos os registros passando os dados para paginação
                const diagrams = await Diagram.scope({ method: ['byUser', user_id] }).findAll(queryOptions);
    
                let result = diagrams.map(item => ({
                    ...item.dataValues,
                    favorite: !!item.favorite.length,
                    diagram_svg: FILES_PATH + item.diagram_svg
                }));
    
                return res.json({ diagrams: result });
    
            } catch (error) {
                return handleExceptions(error, res);
            }
            
        }
    },    

    getAllShared: {
        handler: async (req, res) => {

            try {

                const user_id = req.user_id;
    
                const diagrams = await Diagram.findAll({
                    where: {
                        '$collaboration.collaborator_id$': user_id
                    },
                    include: [{
                        model: Collaboration,
                        as: 'collaboration',
                        required: true
                    }, 
                    {
                        model: Favorite, 
                        as: "favorite", 
                        where: {'$favorite.user_id$': user_id}, 
                        required: false
                    }],
                    order: [['id', 'DESC']] 
                });

                let result = diagrams.map(item => ({...item.dataValues, favorite: !!item.favorite.length, diagram_svg: FILES_PATH+item.diagram_svg}));

                return res.json({diagrams: result});
    
            } catch (error) {
                return handleExceptions(error, res);
            }
            
        }
    },

    getAllFavorited: {
        handler: async (req, res) => {

            try {

                const user_id = req.user_id;
    
                const diagrams = await Diagram.findAll({
                    where: {
                        '$favorite.user_id$': user_id
                    },
                    include: [
                    {
                        model: Favorite, 
                        as: "favorite", 
                        where: {'$favorite.user_id$': user_id}
                    }],
                    order: [['id', 'DESC']] 
                });

                let result = diagrams.map(item => ({...item.dataValues, favorite: !!item.favorite.length, diagram_svg: FILES_PATH+item.diagram_svg}));

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
    
                    let file_err = fs.writeFile(path.join(UPLOADS_FOLDER, file_name), diagram_svg,  function (err) {
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

                
                const collaborator = await Collaboration.findOne({raw: true, where : {collaborator_id : user_id, diagram_id: diagram.id}});

                if (collaborator && collaborator.permission == 1) {
                    return res.status(404).json({ errors: [{msg: "Usuário sem permissão para renomear diagrama!"}] });
                }

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

                
                const collaborator = await Collaboration.findOne({raw: true, where : {collaborator_id : user_id, diagram_id: diagram.id}});

                if (collaborator && collaborator.permission == 1) throw {errors};
               
                let file_name = Math.random().toString(36).slice(2, 12)+'.svg';
                
                if (diagram_svg) {
                
                    if (fs.existsSync(path.join(UPLOADS_FOLDER, diagram.diagram_svg)) && diagram.diagram_svg)
                        fs.unlinkSync(path.join(UPLOADS_FOLDER, diagram.diagram_svg));

                    let file_err = fs.writeFile(path.join(UPLOADS_FOLDER, file_name), diagram_svg,  function (err) {
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
                

                await Favorite.scope({ method: ['byDiagram', id] }).destroy({ where: {user_id:user_id} });
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
            body("format").isInt({min: 1, max: 4}).withMessage("Formato inválido!")
        ], 
        handler: async (req, res) => {
            
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) 
                    throw {name: 'RequestValidationError', errors};

                const { svg, format } = req.body;

                const formats = ["png", "jpeg", "webp", "pdf"];
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
                    case "pdf":
                        data = await new Promise((resolve, reject) => {
                                const pdfDoc = new PDFDocument();
                                const buffers = [];
                        
                                pdfDoc.on('data', buffers.push.bind(buffers));
                                pdfDoc.on('end', () => {
                                    const pdfData = Buffer.concat(buffers);
                                    resolve(pdfData);
                                });
                        
                                pdfDoc.on('error', reject);
                        
                                SVGtoPDF(pdfDoc, svg, 0, 0);
                                pdfDoc.end();
                            });
                        break;
                    default:
                        return res.status(400).json({ errors: [{msg: "Formato inválido!"}] });
                }
                return res.json({img: data.toString("base64"), format: img_format});
                
            } catch (error) {
                return handleExceptions(error, res);
            }
        }
    },

    getRecent: {
        handler: async (req, res) => {
            try {
                const user_id = req.user_id;
                const limit = parseInt(req.query.limit) || 10; // limite 
                const order = req.query.order || 'updated_at'; // ordem 
                const direction = req.query.direction || 'DESC'; // Direção 

                const queryOptions = {
                    order: [[order, direction]], 
                    include: [{ 
                                model: Favorite, 
                                as: "favorite", 
                                where: { '$favorite.user_id$': user_id }, 
                                required: false 
                            }]};
                if (limit) {queryOptions.limit = limit;}

                // Busca no banco
                const [diagrams, diagramsshared] = await Promise.all([
                    Diagram.scope({ method: ['byUser', user_id] }).findAll(queryOptions),
                    Diagram.findAll({
                        where: { '$collaboration.collaborator_id$': user_id },
                        include: [{
                                    model: Collaboration,
                                    as: 'collaboration',
                                    required: true
                                },{
                                    model: Favorite,
                                    as: "favorite",
                                    where: { '$favorite.user_id$': user_id },
                                    required: false
                                }],
                                order: [['id', 'DESC']]
                        })]);
                // Combina os resultados
                const combinedResults = [...diagrams, ...diagramsshared];
                // Formatar os resultados
                const formattedResults = combinedResults.map(item => ({
                    ...item.dataValues,
                    favorite: !!item.favorite.length,
                    diagram_svg: FILES_PATH + item.diagram_svg
                }));
                // Ordenar o array 
                formattedResults.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                // Limita
                const resultOrder = limit ? formattedResults.slice(0, limit) : formattedResults;
                return res.json({ diagrams: resultOrder });
            } catch (error) {
                return handleExceptions(error, res);
            }
        }
    },

    getThumbnail: {
        handler: async (req, res) => {
            try {
                
                const { filename } = req.params;
                const filePath = path.join(UPLOADS_FOLDER, filename);

                if(fs.existsSync(filePath)) {
                    const svgContent = await fs.promises.readFile(filePath, 'utf-8');
                    return res.json({svgContent: svgContent});                
                } else {
                    return res.status(404).json({ error: 'Arquivo não encontrado' });
                }
    
            } catch (error) {
                return handleExceptions(error, res);
            }
            
        }
    }

}
