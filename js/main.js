document.addEventListener("DOMContentLoaded",function(){
    var config={
        bird:{

        },
        pipe:{

        },
        floor:{


        }
    };
    var f = new floor();
    f.setLoop();
})

class bird{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.g=10;
        this.v=0;
        this.body = document.getElementsByClassName('bird')[0];
    }
    move(){

    }
    G(secondes){
        return this.g*seconds/2;
    }
}
class pipe{
    constructor{
        this.width = 0;
        this.gap = 100;
    }
}
class floor{
    constructor(){
        this.index = 0;
        this.speed = 10;
        this.floor = document.getElementsByClassName('floor')[0];
    }
    setLoop(){
        return setInterval(()=>{
            this.floor.style.marginLeft = this.index + 'px';
            this.index -= this.index <= -300 ? this.index:this.speed ;
        },50);
    }
}