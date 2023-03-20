 const xss = require('xss');
 function resMessage({success=false,message="",data=null,status=404}){
    console.log(data);
    return {
        "message":message,
        "success":success,
        "data":data ,
        "status":status
    }

}
function valXss(val){
    return xss(val)
}
module.exports={
    resMessage,
    valXss
}