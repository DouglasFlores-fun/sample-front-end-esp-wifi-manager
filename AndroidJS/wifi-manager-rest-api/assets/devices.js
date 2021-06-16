

new Vue({
  el: '#app',
  data: {
  	networks: []
  },
  methods: {
        updateNetworks: function(){
            if(!app.wifi.isEnabled()){
                app.toast.show("Habilitando Wi-fi");
                app.wifi.enable();
            }
            app.toast.show("Escaneando Redes");
            this.networks = app.wifi.getScanResults().map(function(network){
                let newNetwork = network;
                newNetwork.isActive = false;
                return newNetwork;
            });
        },        
        activeNetwork: function(ssid){
            this.networks = this.networks.map(function(network){
                let newNetwork = network;
                newNetwork.isActive = false;
                if(newNetwork.SSID === ssid){
                    newNetwork.isActive = true;
                }
                return newNetwork;
            });
        },
        connectNetwork: function(ssid){
            const passwd = document.getElementById("net-passwd").value;
            app.toast.show(passwd, 1);
            app.wifi.disconnect();
            app.wifi.connect(ssid, passwd);
        },
        getState: function(){
            app.toast.show(app.wifi.getState());
        }
  }
});
