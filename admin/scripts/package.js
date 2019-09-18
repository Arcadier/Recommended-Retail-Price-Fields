(function() {
var scriptSrc = document.currentScript.src;
var packagePath = scriptSrc.replace('/scripts/package.js', '').trim();
var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
var packageId = re.exec(scriptSrc.toLowerCase())[1];
document.addEventListener('DOMContentLoaded', function () {
const HOST = window.location.host;
var customFieldPrefix = packageId.replace(/-/g, "");
var userId = $('#userGuid').val();
var accessToken = 'Bearer ' + getCookie('webapitoken');
var rrpStatusExist = false;
var rrpStatusFieldId = 0;
var code = "";
var rrpStatusFieldCode = "";
var rrpPackageCheckBox = document.getElementById('myonoffswitch');
//switch
rrpPackageCheckBox.addEventListener('change', () => {
  saveStatus(rrpPackageCheckBox.checked);
});
  
  function getMarketplaceCustomFields(callback){
    var apiUrl = '/api/v2/marketplaces'
    $.ajax({
        url: apiUrl,
        method: 'GET',
        contentType: 'application/json',
        success: function(result) {
            if (result) {
                callback(result.CustomFields);
            }
        }
    });
  }

function saveStatus(rrpStatus) {
  var data = { 'userId': userId, 'status': rrpStatus };
   var apiUrl = packagePath + '/package_switch.php';
  $.ajax({
      url: apiUrl,          
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function(response) {
         if(rrpStatus == 1){
         toastr.success('RRP plugin is enabled.');
         }else { 
           toastr.success('RRP plugin is disabled.');
        }
        
      },
      error: function (jqXHR, status, err) {
            toastr.error('---');
      }
  });
}

$(document).ready(function() {
  getMarketplaceCustomFields(function(result) {
      $.each(result, function(index, cf) {
          if (cf.Name == 'RRP Status' && cf.Code.startsWith(customFieldPrefix)) {
               code = cf.Code;
              var rrp_status = cf.Values[0];
              if (rrp_status == 'true') {
                rrpPackageCheckBox.checked = true;
              } else {
                rrpPackageCheckBox.checked = false;
              }    
          }
          
      })
  });

});

function getCookie (name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  
});
})();
