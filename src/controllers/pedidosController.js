const mysql = require('../mysql').pool



exports.getPedidos = (req,res,next) => {
    mysql.getConnection((error,conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT pedidos.id_pedidos, pedidos.quantidade, pedidos.id_produto, produtos.nome, produtos.preco
             FROM pedidos
             INNER JOIN produtos
                ON produtos.id_produtos = pedidos.id_produto`,
            (error, resultado, fields) => {
                if(error) { return res.status(500).send({ error: error }) }
                
                const response = {
                    pedidos: resultado.map(pedido => {
                        return {
                            id_pedido: pedido.id_pedido,
                            quantidade: pedido.quantidade,
                            produto: {
                                id_produto: pedido.id_produto,
                                nome: pedido.nome,
                                preco: pedido.preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os pedidos',
                                url: process.env.URL_GET_PEDIDOS + pedido.id_pedido
                            } 
                        }
                    })
                }

                return res.status(200).send(response)
            }
        )
    })
}

exports.postPedidos = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?',
            [req.body.id_produto],
            (error, resultado, field) => {
                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                } 
                
                if(resultado.length == 0){
                    return res.status(404).send({
                        mensagem: 'Produto não encontrado'
                    })
                }
                
                conn.query(
                    'INSERT INTO pedidos(id_produto, quantidade) VALUES (?,?)',
                    [req.body.id_produto, req.body.quantidade],
                    (error, resultado, field) => {
                        conn.release()
                        if(error){
                            return res.status(500).send({
                                error: error,
                                response: null
                            })
                        }
                        
                        const response = {
                            message: 'Pedido inserido com sucesso',
                            pedidoCriado: {
                                id_pedido: resultado.id_pedido,
                                id_produto: req.body.id_produto,
                                quantidade: req.body.quantidade,
                                request: {
                                    tipo: 'POST',
                                    descricao: 'Insere um produto',
                                    url: process.env.URL_GET_PEDIDOS
                                } 
                            }
                        }
        
                        return res.status(201).send(response)
                        
                    }
                )
            }
        )
    })

    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
    })

}

exports.getIdPedido = (req,res,next) => {
    mysql.getConnection((error,conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?',
            [req.params.id_pedido],
            (error, resultado, fields) => {
                if(error) { 
                    return res.status(500).send({ 
                        error: error
                    }) 
                }
                
                if(resultado.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não encontrado pedido para esse id'
                    })
                }
                
                const response = {
                    pedido: {
                        id_pedido: resultado[0].id_pedido,
                        id_produto: resultado[0].id_produto,
                        quantidade: resultado[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna pedido por id',
                            url: process.env.URL_GET_PEDIDOS
                        } 
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
}

exports.deletePedido = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query(
            'DELETE FROM pedidos WHERE id_pedido = ?',
            [req.body.id_pedido],
            (error, resultado, field) => {
                conn.release()
                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }

                const response = {
                    mensagem: 'Pedido removido com sucesso',
                    request: {
                        tipo: 'DELETE',
                        descricao: 'Deleta pelo id'
                    }
                }

                return res.status(202).send(response)
                
            }
        )
    })

}