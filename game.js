function letsPlay(){
    const canvas = document.getElementById("canvas");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.style.position = "fixed";
    const drawer = canvas.getContext("2d");
    var pause = false;
    var toAccelerate = true;
    var accelerateAt = 5;
    var pipeWidth = 50;
    var pipeHGap = 250;
    var pipeVGap = 200;
    var pipeVelocity = 1;
    var velocity = 0;
    var gravity = 0.06;
    var score = 0;
    var screenSize = window.innerWidth;
    var numOfPipe = Math.round((screenSize/(pipeHGap+pipeWidth)))+2;
    var box = {
        left:130,
        top:0,
        width:25,
        height:25
    }
    var pipe = [];
    for(i=0;i<numOfPipe;i++){
        pipe.push(giveMePipe());
    }
    gaming = setInterval(function(){
        if(!pause){
            drawer.clearRect(0, 0, canvas.width, canvas.height);
            if((box.top >= 0) && (box.top+box.height < canvas.height)){
                velocity = velocity + gravity ;
            }
            if(box.top<0){
                box.top = 0;
                velocity=0;
            }
            if(box.top>(canvas.height-box.height-10)){
                box.top = canvas.height - box.height - 1;
                velocity = 0;
            }
            box.top = box.top + velocity ;
            drawer.fillRect(box.left, box.top, box.width, box.height);
            var clerkUpdated = false;
            for(eachPipe of pipe){
                if((eachPipe.topPipe.left+ eachPipe.topPipe.width) < 0){
                    pipe.shift();
                    pipe.push(giveMePipe());
                }
                if(!clerkUpdated){
                    if(((eachPipe.bottomPipe.left+eachPipe.bottomPipe.width) < box.left)
                    &&(eachPipe.bottomPipe.left+eachPipe.bottomPipe.width) >= (box.left-pipeVelocity)){
                    score ++;
                    clerkUpdated = true;
                    toAccelerate = true;
                }
                }
                if(score%accelerateAt === 0){
                    if(toAccelerate){
                        pipeVelocity += 0.1;
                        toAccelerate = false;
                    }
                }
                eachPipe.topPipe.left -= pipeVelocity;
                eachPipe.bottomPipe.left -= pipeVelocity;
                drawer.fillStyle = "skyblue";
                drawer.fillRect(0, 0, (box.left-5), 30);
                drawer.fillStyle = "Black";
                drawer.font = "25px Arial";
                drawer.fillText("Score: "+score, 5, 25);
                drawer.fillStyle = "darkgreen";
                drawer.fillRect(eachPipe.topPipe.left, eachPipe.topPipe.top, eachPipe.topPipe.width, eachPipe.topPipe.height);
                drawer.fillRect(eachPipe.bottomPipe.left, eachPipe.bottomPipe.top,  eachPipe.bottomPipe.width,  eachPipe.bottomPipe.height);
                drawer.fillStyle = "Black";
                drawer.font = "25px Centaur";
                drawer.fillText("Created By: Prashant S.",(canvas.width-213), (canvas.height-5))
                if(checkCollision(eachPipe, box)){
                    clearInterval(gaming);
                    if(window.confirm("Restart?")){
                        letsPlay();
                    }
                }
            }
        }
    },10);
    function giveMeRandomHeight(min,max){
        return Math.floor( Math.random()*(max - min + 1)) + min ;
    }
    function giveMePipe(){
        currentTopPipeHeight = giveMeRandomHeight(0,canvas.height-pipeVGap-40);
        if(pipe.length == 0){
            pipeXOffSet = box.left + box.width + 250;
        }else{
            lastPipeXOffSet = pipe[pipe.length-1].topPipe.left;
            pipeXOffSet = lastPipeXOffSet + pipeHGap;
        }
        return {
            topPipe : {
                top:0,
                left:pipeXOffSet,
                width:pipeWidth,
                height:currentTopPipeHeight
            }, bottomPipe : {
                top:currentTopPipeHeight+pipeVGap,
                left:pipeXOffSet,
                width:pipeWidth,
                height:canvas.height-currentTopPipeHeight-pipeVGap
            }   
        }
    }

    function checkCollision(pipe, box){
        if(
            (
                pipe.topPipe.left < box.left + box.width &&
                pipe.topPipe.left + pipe.topPipe.width > box.left &&
                pipe.topPipe.top < box.top + box.height && 
                pipe.topPipe.height + pipe.topPipe.top > box.top
            )
            ||
            (
                pipe.bottomPipe.left < box.left + box.width &&
                pipe.bottomPipe.left + pipe.bottomPipe.width > box.left &&
                pipe.bottomPipe.top < box.top + box.height && 
                pipe.bottomPipe.height + pipe.bottomPipe.top > box.top
            )
        ){
            return true;
        }else{
            return false;
        }
    }
    window.addEventListener("keydown",function(e){
        if((e.key == " ")||(e.key == "ArrowUp")){
            if(pause){
                pause = false;
                box.top -= 2;
                velocity -= 1;
            }else{
                box.top -= 5;
                velocity -= 3.2;
            }
        }else if(e.key == "Enter"){
            pause = true;
        }
    })
}
letsPlay()