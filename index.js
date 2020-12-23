
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log('conexion éxitosa');
})

app.get('/carro', (req, res) => {
    let carro = fs.readFileSync('./carro.txt', 'utf8');
    
    let producto = JSON.parse(carro);
    res.send(producto);
})

app.post('/carro/producto/:producto', (req, res) => {
    let carro = fs.readFileSync('./carro.txt', 'utf8');
    let productos = JSON.parse(carro);
    
    let claveProducto = JSON.parse(req.params.producto);
    const index = productos.findIndex(producto => producto.id === claveProducto.id);
    if(index === -1){
        productos.push(claveProducto);
    }else{
        productos.splice(index, 1, claveProducto);
    }

    fs.writeFileSync('./carro.txt', '');
    fs.writeFileSync('./carro.txt', JSON.stringify(productos)); 

    res.send('Se añadió al carrito éxitosamente');
})

app.delete('/carro', (req, res) => {
    fs.writeFileSync('./carro.txt', '[]');
    res.send('El carrito de compras está vacío');
})

app.delete('/carro/productos/:id', (req, res) => {
    let carro = fs.readFileSync('./carro.txt', 'utf8');
    let productos = JSON.parse(carro);
    
    let claveProducto = parseInt(req.params.id);
    const index = productos.findIndex(producto => producto.id === claveProducto);

    productos.splice(index, 1);

    fs.writeFileSync('./carro.txt', '');
    fs.writeFileSync('./carro.txt', JSON.stringify(productos));
    res.send('producto eliminado del carrito');
})

app.get('/almacen', (req, res) => {
    let almacen = fs.readFileSync('./almacen.txt', 'utf8');
    let producto = JSON.parse(almacen);
    res.send(producto);
})

app.post('/almacen/producto/:producto', (req, res) => {
    let almacen = fs.readFileSync('./almacen.txt', 'utf8');
    let productos = JSON.parse(almacen);
    
    let claveProducto = JSON.parse(req.params.producto);
    const index = productos.findIndex(producto => producto.id === claveProducto.id);
    if(index === -1){
        productos.push(claveProducto);
    }else{
        productos.splice(index, 1, claveProducto);
    }

    fs.writeFileSync('./almacen.txt', '');
    fs.writeFileSync('./almacen.txt', JSON.stringify(productos)); 

    res.send('Se añadió al almacen éxitosamente');
})

app.delete('/almacen/productos/:id', (req, res) => {
    let almacen = fs.readFileSync('./almacen.txt', 'utf8');
    let productos = JSON.parse(almacen);
    
    let claveProducto = parseInt(req.params.id);
    const index = productos.findIndex(producto => producto.id === claveProducto);

    productos.splice(index, 1);

    fs.writeFileSync('./almacen.txt', '');
    fs.writeFileSync('./almacen.txt', JSON.stringify(productos));
    res.send('producto eliminado del carrito');
})

app.get('/almacen/:filtro/:keyword', (req, res) => {
    let filtro = req.params.filtro;
    let keyword = req.params.keyword;
    let almacen = fs.readFileSync('./almacen.txt', 'utf8');

    let productos = JSON.parse(almacen);
    let respuesta = productos.filter(producto => producto[filtro] === keyword);

    res.send(respuesta);
})

app.post('/pagar', (req, res) => {
    let carro = fs.readFileSync('./carro.txt', 'utf8');
    let productos = JSON.parse(carro);
    let mensaje = '';
    let totalPagar = 0;
    let compraValida = 0;
    let almacen = fs.readFileSync('./almacen.txt', 'utf8');
    let stock = JSON.parse(almacen);

    productos.forEach(producto => {
        let index = stock.findIndex(Producto => Producto.id === producto.id)
        totalPagar += parseInt(stock[index].precio) * producto.cantidad;
        if(producto.cantidad > stock[index].cantidad){
            compraValida = 1;
        }
    });
    
    if(compraValida === 0){
        
        productos.forEach(producto => {
            let index = stock.findIndex(Producto => Producto.id === producto.id)
            stock[index].cantidad -= producto.cantidad;
        });

        mensaje = 'El total a pagar es: ' + totalPagar;
        fs.writeFileSync('./carro.txt', '[]');
        fs.writeFileSync('./almacen.txt', '');
        fs.writeFileSync('./almacen.txt', JSON.stringify(stock));

    }else{
        mensaje = 'La cantidad que se quiere comprar es mayor a lo que está en stock';
    }
    
    res.send(mensaje);
})







