const express = require('express');
const app = express();
const port = 8003;

app.get('/response', (req,res)=>{
    console.log(`server is giving reponse.`);
    return res.status(200).json({
        message : "server is running fine on 8003",
    });
})

app.get('/health', (req, res) => {
    return res.status(200).json({
        message: "Server is running fine on 8003",
    });
});


app.listen(port, ()=>{
    console.log(`server is running fine on 8003`);
    
})