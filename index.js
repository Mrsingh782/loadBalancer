// const request = require('request');
const express = require('express');
const app = express();
const axios = require('axios');
let currentServerIterator = 0;

const servers = [
    {host: 'http://localhost:8001/', port:8001, ishealthy : true},
    {host: 'http://localhost:8002/', port:8002, ishealthy : true},
    {host: 'http://localhost:8003/', port:8003, ishealthy : true},
];

// create a middleware to check health status of the applications. 
function checkHealth(){
    // if status code comes out to be 200 then ok otherwise mark ishealthy false.
    // axios call marunga api health ke lie and then uske according usko treat krunga. 

    servers.forEach((server)=> {
        let url = server.host + 'health';
        axios.get(url)
            .then(response => {
                // console.log(response);
                if(response.status==200){
                    server.ishealthy = true;
                } else {
                    server.ishealthy = false;
                }
            })
            .catch(err => {
                console.log(err.message);
            })

        
    })

}


// create a middleware which store the servers and make calls alterantively -> if found healthy. 
function loadBalancer(req, res, next) { 
    checkHealth();
    let activeServers = [];
    servers.forEach((server) => {
        if( server.ishealthy == true ){
            activeServers.push(server.port);
            // console.log(`we are with the servers ${server.port}`);

        }
    });

    // now we have a active server, lets make a demo call to a server artificially.

    let url = servers[currentServerIterator].host + 'response';
    currentServerIterator = (currentServerIterator + 1) % activeServers.length;

    axios.get(url)
        .then(response => {
            console.log(response.data.message);
            return res.send(response.data.message);
           
        }) 
        .catch(err => {
            console.log(err);
        })



    activeServers.forEach((port)=>{
        console.log(`port number is ${port}`);
    });

}

app.get('/', loadBalancer);

app.listen(3000, ()=>{
    console.log(`Hey there my server is working fine on 3000.`);
    loadBalancer();
});
