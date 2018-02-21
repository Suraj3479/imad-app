var button=document.getElementById("counter");

button.onclick=function(){
    
    var request=new XMLHttpRequest();
    
    request.onreadystatechange=function(){
        if(request.readystate=== XMLHttpRequest.DONE){
            
            if(reque.ststatus===200){
                var counter=request.respnseText;
                var span=document.getElementById("count");
               span.innerHTML=counter.toString();
            }
        }
        
    };
request.open('Get','kishorsuraj1997.imad.hasura-app.io/counter',true);
request.send(null);
};