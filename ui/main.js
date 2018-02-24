var button=document.getElementById('counter');
var counter=0;
button.onclick=function(){
    
    var request=new XMLHttpRequest();
    
    request.onreadystatechange=function(){
        if(XMLHttpRequest.readyState===XMLHttpRequest.DONE){
            if(XMLHttpRequest.status===200){
                var counter=XMLHttpRequest.responseText;
                var span=document.getElementById('count');
                span.innerHTML=counter.toString();
            }
        }
        
    };
request.open('GET','kishorsuraj1997.imad.hasura-app.io/counter',true);
request.send(null);
};