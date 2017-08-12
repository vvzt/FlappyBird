class bird{
    constructor(){
        this.start = false;
        this.y = content.offsetTop+content.clientHeight/2;//Y轴
        this.x = 100;
        this.v = 15;
        this.g = 10;
        this.maxFallSpeed = 20;
        this.time = 0;//s
        this.headIndex = 0;
        this.wingsIndex = 0;
        this.wingsSpeed = 120;
        this.body = document.getElementsByClassName('bird')[0];
        this.timeCount();
    }
    fly(){//扇动翅膀
        return setInterval(()=>{
            this.wings(this.wingsIndex);
            this.wingsIndex++;
            if(this.wingsIndex > 2) this.wingsIndex = 0;
        },this.wingsSpeed);
    }
    wings(index){
        return this.body.style.backgroundPosition = index==0?'top':(index==1?'center':'bottom');
    }
    timeCount(){//计算下落时间
        return setInterval(()=>{ this.time++; },1000);
    }
    init(){
        let content = document.getElementById('content');
        content.addEventListener('click',()=>{//点击上飞
            this.v = 15;
            this.time = 0;
            this.headIndex = -35;
            if(this.y-80 < this.body.parentNode.offsetTop) this.y = this.body.parentNode.offsetTop;
            else this.y -= 80;
        });
        this.body.style.cssText = `top:${this.y}px;margin-left:${this.x}px`;//初始化bird位置
        this.start = true;//表示已点击开始
        return setInterval(()=>{
                    if(this.y < this.body.parentNode.clientHeight + this.body.parentNode.offsetTop - 150){
                        if(this.g*this.time>this.maxFallSpeed) this.v=this.maxFallSpeed;
                        else this.v+=this.g*this.time;
                        this.y += this.v*this.time/2;
                        if(this.headIndex <= 35) this.headIndex+=this.g;
                        this.body.style.transform = `rotate(${this.headIndex}deg)`;
                        //this.body.style.top = `${this.y}px`;
                        $('.bird').stop().animate({top:`${this.y}px`},120);
                    }
                    },70)
    }
}

class pipe extends bird{
    constructor(){
        super();
        this.pipesX = 500;
        this.pipesCopyX = 1376;
        this.pipeHeadHeight = 64/1.5;
        this.gap = 200;
        this.pipes = document.getElementsByClassName('pipes')[0].getElementsByClassName('pipe');
        this.copyPipe(this.pipes);
        this.setPipe(this.pipes);
        this.setPipe(this.pipesCopy);
        //this.pipesMove();
    }
    copyPipe(pipes){
        let elements = [];
        for(let p of pipes){
            elements.push(p.cloneNode(true));
        }
        let copy = document.createElement('div');
        copy.className = 'pipesCopy';
        console.log(copy);
        document.getElementById('content').appendChild(copy);
        for(let e of elements){
            document.getElementsByClassName('pipesCopy')[0].appendChild(e);
        }
        this.pipesCopy = document.getElementsByClassName('pipesCopy')[0].getElementsByClassName('pipe');
    }
    setPipe(pipes){
        for(let p of pipes){
            let pbh = Math.ceil(Math.random()*300);
            pbh = pbh > 350 ? 350:pbh;
            for(let t of p.getElementsByClassName('top')) {
                t.getElementsByClassName('pipeBody')[0].style.height = `${pbh}px`;
            }
            for(let b of p.getElementsByClassName('bottom')){
                b.getElementsByClassName('pipeBody')[0].style.height = `${555 - pbh - this.pipeHeadHeight*2 - this.gap}px`;
            }
        }
    }
    pipesMove(){
        return setInterval(()=>{
            this.pipesX-=10;
            this.pipesCopyX-=10;
            $(this.pipes).animate({marginLeft:`${this.pipesX}px`});
            $(this.pipesCopy).animate({marginLeft:`${this.pipesCopyX}px`});
        },80);
    }
}

class floor extends bird{
    constructor(){
        super();
        this.index = 0;
        this.speed = 10;
        this.floor = document.getElementsByClassName('floor')[0];
        this.setLoop();
    }
    setLoop(){
        return setInterval(()=>{
            this.floor.style.marginLeft = this.index + 'px';
            this.index -= this.index <= -300 ? this.index:this.speed ;
        },50);
    }
}

document.addEventListener("DOMContentLoaded",function(){
    let b = new bird();
    b.fly();
    let f = new floor();
    let p = new pipe();
    let elements = {
        logo : document.getElementsByClassName('logo')[0],
        bird : document.getElementsByClassName('bird')[0],
        start : document.getElementsByClassName('start')[0]
    }
    let gameReady = document.getElementsByClassName('gameReady')[0];
    elements.start.addEventListener('click',()=>{//点击start
        for(let e of Object.values(elements)){
            e.style.display = 'none';
        }
        gameReady.style.display = 'block';
    });
    gameReady.addEventListener('click',()=>{//ready点击
        b.init();
        gameReady.style.display = 'none';
        elements.bird.style.display = 'block';
    })
})
