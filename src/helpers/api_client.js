const axios = require("axios");


 async function get(uri=""){
    const response = await axios.get(uri);
    let html ='';
    if(response.status===200){
         html = response.data;
    }
    return html;
}
module.exports = {
    get
}
// axios.get('https://nontonanimeid.cfd/').then((response)=>{
//     if (response.status==200){
//         const html = response.data;
//         const $ = cheerio.load(html);
//         let data = [];
//         $("main article").each(function (i,elem){
//             data[i]={
//                 title: $(this).find("h3").text().trim(),
//                 episode: $(this).find(".sera a div .types").text().trim(),
//                 watch_url:$(this).find(".sera a").attr('href'),
//                 image_url:$(this).find(".sera a div img ").attr('data-src'),
//             }
//         });

//         console.log(data);

//     }
// }),(error)=> console.log(error)