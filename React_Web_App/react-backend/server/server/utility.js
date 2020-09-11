function format(date) {
    let month = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)));
    let day = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()));
    let year = date.getFullYear();
    return  year+'-'+month+'-'+day;
  }

function formatText(text){
  arr = text.split(".");
  var modified = ""
  for(var i=0;i<4;i++){
     modified+=arr[i]+".";
  }
  modified+="</p><p>";
  for(var i=4;i<arr.length;i++){
    modified+=arr[i]+".";
  }
}

module.exports = {
    format : format,
    formatText : formatText
}