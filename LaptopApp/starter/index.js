const fs=require('fs');
const http=require('http');
const url=require('url');
const json=fs.readFileSync(`${__dirname}/data/data.json`,'utf-8');
const laptopData=JSON.parse(json);
console.log(__dirname);
console.log(laptopData);

const server=http.createServer((req,res)=>{
    const pathName=url.parse(req.url,true).pathname;
    const id=url.parse(req.url,true).query.id;
    if(pathName==='/products'||pathName==='/'){
    res.writeHead(200,{'Content-type':'text/html'});
    fs.readFile(`${__dirname}/templates/template-overview.html`,'utf-8',(err,data)=>{
        let overviewOutput=data;
        fs.readFile(`${__dirname}/templates/template-card.html`,'utf-8',(err,data)=>{
            const cardsOutput=laptopData.map(el=>replaceTemplate(data,el)).join('');
           overviewOutput=overviewOutput.replace('{%CARDS%}',cardsOutput);
           res.end(overviewOutput);
        });
    });
    
    }
    else if(pathName==='/laptop' && id<laptopData.length){
        res.writeHead(200,{'Content-type':'text/html'});
        fs.readFile(`${__dirname}/templates/template-laptop.html`,'utf-8',(err,data)=>{
            const laptop=laptopData[id];
            const output=replaceTemplate(data,laptop);
            res.end(output);
        });
        //res.end(`This is the laptop!${id}`);
    }// IMAGES
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg'});
            res.end(data);
        });
    }
    else{
        res.writeHead(404,{'Content-type':'text/html'});
    res.end('Page not found!');
    }
});

server.listen(1337,'127.0.0.1',()=>{
    console.log('Listening for requestes');
});

function replaceTemplate(originalHTML,laptop){
    let output=originalHTML.replace(/{%PRODUCTNAME%}/g,laptop.productName);
    output=output.replace('{%IMAGE%}',laptop.image);
    output=output.replace(/{%PRICE%}/g,laptop.price);
    output=output.replace('{%SCREEN%}',laptop.screen);
    output=output.replace('{%RAM%}',laptop.ram);
    output=output.replace('{%CPU%}',laptop.cpu);
    output=output.replace('{%DESCRIPTION%}',laptop.description);
    output=output.replace('{%STORAGE%}',laptop.storage);
    output=output.replace('{%ID%}',laptop.id);
    return output;
}
