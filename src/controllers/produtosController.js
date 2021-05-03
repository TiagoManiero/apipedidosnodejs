const mysql = require('../mysql')

exports.getProdutos = async(req, res, next) => {
    try {
        const resultado = await mysql.execute('SELECT * FROM produtos')
        const response = {
            quantidade: resultado.length,
            produtos: resultado.map(prod => {
                return {
                    id_produto: prod.id_produto,
                    nome: prod.nome,
                    preco: prod.preco,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos',
                        url: process.env.URL_GET_PRODUTOS + prod.id_produto
                    } 
                }
            })
        }
        return res.status(200).send(response)

    } catch(error) {
        return res.status(500).send({ error: error }) 
    } 
}


exports.postProdutos = async(req,res,next) => {
    try{
        const query = 'INSERT INTO produtos(nome, preco, imagem_produto) VALUES (?,?,?)'
        const resultado = await mysql.execute(query, [req.body.nome, req.body.preco, req.file.path])

        const response = {
            message: 'Produto inserido com sucesso',
            produtoCriado: {
                id_produto: resultado.id_produto,
                nome: req.nome,
                preco: req.preco,
                imagem_produto: req.file.path,
                request: {
                    tipo: 'POST',
                    descricao: 'Insere um produto',
                    url: process.env.URL_GET_PRODUTOS 
                } 
            }
        }

        return res.status(201).send(response)

    }catch(error){
        return res.status(500).send({ error: error })
    }

}

exports.getIdProdutos = async (req,res,next) => {
    try{
        const query = 'SELECT * FROM produtos WHERE id_produto = ?'
        const resultado = await mysql.execute(query,[req.params.id_produto])
        
        if(resultado.length == 0){
            return res.status(404).send({
                mensagem: 'Não encontrado registro com o id'
            })
        }
        
        const response = {
            produto: {
                id_produto: resultado[0].id_produto,
                nome: resultado[0].nome,
                preco: resultado[0].preco,
                imagem_produto: resultado[0].imagem_produto,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna produto por id',
                    url: process.env.URL_GET_PRODUTOS
                } 
            }
        }
        return res.status(200).send(response)

    }catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.patchProdutos = async (req,res,next) => {
    try{
        const query = `UPDATE produtos SET nome = ? preco = ?
                        WHERE id_produto = ?`
        await mysql.execute(query,[req.body.nome, req.body.preco, req.body.id_produto])
        const response = {
            message: 'Produto atualizado com sucesso',
            produtoAtualizado: {
                id_produto: req.body.id_produto,
                nome: req.body.nome,
                preco: req.body.preco,
                request: {
                    tipo: 'PATCH',
                    descricao: 'Atualiza um produto',
                    url: process.env.URL_GET_PRODUTOS + req.prod.id_produto
                } 
            }
        }
        res.status(202).send(response)

    }catch(error){
        return res.status(500).send({ error: error })
    }

}

exports.deleteProdutos = async (req,res,next) => {
    try{
        const query = 'DELETE FROM produtos WHERE id_produto = ?'
        await mysql.execute(query,[req.body.id_produto])
        const response = {
            mensagem: 'Produto removido com sucesso',
            request: {
                tipo: 'DELETE',
                descricao: 'Deleta pelo id'
            }
        }

        return res.status(202).send(response)

    }catch(error){
        return res.status(500).send({ error: error })
    }

}