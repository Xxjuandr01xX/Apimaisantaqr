var app = new Vue({
  el: '#app',
  data: {
    scanner: null,
    activeCameraId: null,
    cameras: [],
    scans: []
  },
  mounted: function () {
    var self = this;
    self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 2, mirror: false });
    self.scanner.addListener('scan', function (content, image) {
      self.scans.unshift({ date: +(Date.now()), content: content });
      //variables para validacion de identidad.
      let var_param = window.location.href.split('?')[1].split('&');
      let var_user = var_param[1].split("=");

      //Request para pasar contenido del escaneo a la API de miarroba.
      $.post('qrapi.webcindario.com/?pag=API&pro=capture&op=insert_qr_scam', {ced_ide_usuario: var_user[3], chorizo:content}, function(resp){
        alert(resp);
        if(resp == '1'){
          $("#alert_scan_qr").addClass('alert-success');
          $("#alert_scan_qr>p").text('Escaneo realizado con exito.');
          $("#alert_scan_qr").css({'diaplay' : 'block'});
          setTimeout(() => {
            $("#alert_scan_qr").css({ 'diaplay': 'none' });
          }, 1200);
        }else if(resp == 'duplicate'){
          $("#alert_scan_qr").addClass('alert-warning');
          $("#alert_scan_qr>p").text('Ya se realizo el escaneo de este comprobante.');
          $("#alert_scan_qr").css({ 'diaplay': 'block' });
        }
      });
    });
    Instascan.Camera.getCameras().then(function (cameras) {
      self.cameras = cameras;
      
      if (cameras.length > 0) {
        self.activeCameraId = cameras[0].id;
        self.scanner.start(cameras[0]);
      } else {
        console.error('No cameras found.');
      }
    }).catch(function (e) {
      console.error(e);
    });
  },
  methods: {
    formatName: function (name) {
      return name || '(unknown)';
    },
    selectCamera: function (camera) {
      this.activeCameraId = camera.id;
      this.scanner.start(camera);
    }
  }
});
