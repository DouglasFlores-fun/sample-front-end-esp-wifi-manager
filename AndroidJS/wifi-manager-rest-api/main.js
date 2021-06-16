const back = require('androidjs').back;
const request = require('request');

let count = 0; //set limit before launch error


back.on("start-scanning", function(){
    request('http://192.168.1.1/scanWifi', { json: true }, (err, res, body) => {
        if (err) {console.log(err);  return; }
            back.send('start-scanning',JSON.stringify(res.body));
            count = 0;
            checkScanning();
        });
});

function checkScanning(){
    request('http://192.168.1.1/scanStatus', { json: true }, (err, res, body) => {
        if (err) {
            console.log(err);  
            back.send('check-scanning',JSON.stringify({error: true, timeout: false}));
            return;
            
        }
        if(res.body.status === "ended"){
            //back.send('check-scanning',JSON.stringify(res.body));
            back.send('check-scanning',JSON.stringify({error: false, timeout: false}));
            console.log("scanning has ended");
            getNetworks();
        }else{
            console.log("scanning");
            count = count + 1;
            if(count <= 15){
               setTimeout(function(){checkScanning();},2000);
            }else{
               back.send('check-scanning',JSON.stringify({error: false, timeout: true})); 
            }
        }            
    });
}

function getNetworks(){
    request('http://192.168.1.1/networks', { json: true }, (err, res, body) => {
        if (err) {
            console.log(err);  
            back.send('check-scanning',JSON.stringify({error: true, timeout: false}));
            return;
            
        }
        
       back.send('networks',JSON.stringify(res.body));     
    });
}


back.on("save-network", function(data){
    request.post({
            headers: {'content-type' : 'application/json'},
            url:     'http://192.168.1.1/updateWifi',
            body:    data
        }, function(err, res, body){
            if (err) {
                console.log(err);  
                back.send('save-network',JSON.stringify({error: true}));
                return;
                
            }
            if(res.body.error){
                console.log(res.body.error);  
                back.send('save-network',JSON.stringify({error: true}));
                return;
            }
            back.send('save-network',JSON.stringify({error: false}));
            turnOffServer();
        });
});


back.on("turnoff-server", function(data){
    turnOffServer();
});

function turnOffServer(){
    request('http://192.168.1.1/end', { json: true }, (err, res, body) => {
        if (err) {
            console.log(err);  
            back.send('turnoff-server',JSON.stringify({error: true}));
            return;
        }
        back.send('turnoff-server',JSON.stringify({error: false})); 
    });
}

