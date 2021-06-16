

var myVue = new Vue({
  el: '#app',
  data: {
  	networks: []
  },
  methods: {
        startScanning: function(){
            app.toast.show("Iniciando escaneo");
            front.send('start-scanning','');
        },
        updateNetworks: function(esp_networks){
            if(esp_networks.length > 0){
                this.networks = esp_networks.map(function(network){
                    let newNetwork = network;
                    newNetwork.isActive = false;
                    return newNetwork;
                });
                app.toast.show("Escaneo finalizado");
            }else{
                app.toast.show("No se encontro redes disponibles");
            }
        },
        activeNetwork: function(ssid){
            this.networks = this.networks.map(function(network){
                let newNetwork = network;
                newNetwork.isActive = false;
                if(newNetwork.ssid === ssid){
                    newNetwork.isActive = true;
                }
                return newNetwork;
            });
        },
        saveNetwork: function(ssid){
            app.toast.show("Guardando Red y Apagando WifiManager en ESP");
            front.send('save-network',JSON.stringify({ssid: ssid, pass: document.getElementById("net-passwd").value}));
        },
        turnOffWifiManagerEsp: function(){
            front.send('turnoff-server',"");
        }
  }
});

    front.on('start-scanning',function(data){
        console.log(data);
	});
	
	front.on('check-scanning',function(data){
        const info = JSON.parse(data);
        if(info.error){
            app.toast.show("Error buscando redes Wifi");
        }
        if(info.timeout){
            app.toast.show("Se ha superado el tiempo de escaneo");
        }
	});
	
	front.on('networks', function(data){
        const networks = JSON.parse(data).networks;
        myVue.updateNetworks(networks);
	});
	
	front.on('save-network', function(data){
        const info = JSON.parse(data);
        if(info.error){
            app.toast.show("Error actualizando WIFI");
            return;
        }
        app.toast.show("WIFI actualizado");
	});
	
	front.on('turnoff-server', function(data){
        const info = JSON.parse(data);
        if(info.error){
            app.toast.show("Error apagando WIFI manager ESP");
            return;
        }
        app.toast.show("WIFI manager ESP apagando");
	});
