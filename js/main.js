class bird{
    constructor(){
        this.start = false;
        this.y = content.offsetTop+content.clientHeight/2;//Y轴
        this.yBefore = 0;
        this.x = 100;
        this.v = 15;
        this.g = 10;
        this.maxFallSpeed = this.v*2;
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
    headDirection(){
        return setInterval(()=>{
            if(this.y < this.body.parentNode.clientHeight + this.body.parentNode.offsetTop - 150){//未到达最低点时
                if(this.g*this.time>this.maxFallSpeed) this.v=this.maxFallSpeed;
                else this.v+=this.g*this.time;
                this.y += this.v*this.time/2;//设置bird的Y轴位置
                if(this.headIndex <= 25) this.headIndex += 5;//转头的幅度
                this.body.style.transform = `rotate(${this.headIndex}deg)`;
            }else this.y = this.body.parentNode.clientHeight + this.body.parentNode.offsetTop - 150;
        },100);
    }
    bodysHeight(){
        return setInterval(()=>{
            //this.body.style.top = `${this.y}px`;
            $(this.body).stop().animate({top:`${this.y}px`},90);
        },50);
    }
    init(){
        window.addEventListener('click',()=>{//点击上飞
            this.y = parseInt(this.body.style.top);
            this.v = 15;
            this.time = 0;
            this.headIndex = -30;
            if(this.y - 80 < this.body.parentNode.offsetTop) this.y = this.body.parentNode.offsetTop;
            else this.y -= 80;
        });
        this.body.style.cssText = `top:${this.y}px;margin-left:${this.x}px`;//初始化bird位置
        this.start = true;//表示已点击开始
        return [this.headDirection(),this.bodysHeight()];
    }
}
//管子
class pipe{
    constructor(){
        this.pGo = true;//第一轮pipes
        this.pcGo = false;//第二轮pipes(即pipesCopy)
        this.pipesX = 500;
        this.pipesCopyX = 500;
        this.pipeHeadHeight = 64/1.5;//管子头部的高度
        this.gap = 200;//管子间隙
        this.speed = 15;//管子速度
        this.pipes = document.getElementsByClassName('pipes')[0].getElementsByClassName('pipe');
        this.pipesCopy = this.copyPipe(this.pipes);
        this.setPipe(this.pipes);
        this.setPipe(this.pipesCopy);
    }
    copyPipe(pipes){//复制pipes里的三个管子生成并插入
        let elements = [];
        for(let p of pipes){
            elements.push(p.cloneNode(true));
        }
        let copy = document.createElement('div');
        copy.className = 'pipesCopy';//console.log(copy);
        document.getElementById('content').appendChild(copy);
        for(let e of elements){
            document.getElementsByClassName('pipesCopy')[0].appendChild(e);
        }
        return document.getElementsByClassName('pipesCopy')[0].getElementsByClassName('pipe');
    }
    setPipe(pipes){//设置管子的高度、间隙
        for(let p of pipes){
            p.getElementsByClassName('bottom')[0].style.marginTop = `${this.gap}px`;
            let pbh = Math.ceil(Math.random()*250);
            pbh = pbh > 550 - this.gap ? 550-this.gap:pbh;
            for(let t of p.getElementsByClassName('top')) {
                t.getElementsByClassName('pipeBody')[0].style.height = `${pbh}px`;
            }
            for(let b of p.getElementsByClassName('bottom')){
                b.getElementsByClassName('pipeBody')[0].style.height = `${555 - pbh - this.pipeHeadHeight*2 - this.gap}px`;
            }
        }
    }
    pipesMove(){//管子的移动
        return setInterval(()=>{
            if(this.pcGo){
                this.pipesCopyX -= this.speed;
                if(this.pipesCopyX <= -400) this.pGo = true;
                if(this.pipesCopyX <= -900) {
                    this.pipesCopyX = 500;
                    document.getElementsByClassName('pipesCopy')[0].style.marginLeft = `${this.pipesCopyX}px`;
                    this.pcGo = false;
                    this.setPipe(this.pipesCopy);
                }
            }
            if(this.pGo){
                this.pipesX -= this.speed;
                if(this.pipesX <= -400) this.pcGo = true;
                if(this.pipesX <= -900) {
                    this.pipesX = 500;
                    document.getElementsByClassName('pipes')[0].style.marginLeft = `${this.pipesX}px`;
                    this.pGo = false;
                    this.setPipe(this.pipes);
                }
            }
            //document.getElementsByClassName('pipes')[0].style.marginLeft = `${this.pipesX}px`;
            //document.getElementsByClassName('pipesCopy')[0].style.marginLeft = `${this.pipesCopyX}px`;
            $('.pipes').stop().animate({marginLeft:`${this.pipesX}px`},80);
            $('.pipesCopy').stop().animate({marginLeft:`${this.pipesCopyX}px`},80);
        },50);
    }
}
//地板
class floor{
    constructor(){
        this.index = 0;
        this.speed = 10;
        this.floor = document.getElementsByClassName('floor')[0];
        this.setLoop();
    }
    setLoop(){//移动地板
        return setInterval(()=>{
            this.floor.style.marginLeft = `${this.index}px`;
            this.index -= this.index <= -300 ? this.index:this.speed ;
        },50);
    }
}
class birds extends bird{//计分
    constructor() {
        super();
        this.total = 0;
        this.n = document.getElementsByClassName('score')[0].getElementsByTagName('div');
        this.n1 = 0;
        this.n2 = 0;
        this.n3 = 0;

        this.css = (e) => {
            return document.defaultView.getComputedStyle(e, null)
        }
        this.allPipes = document.getElementsByClassName('pipe');
        this.nowPipe;
        this.end = false;

        this.pipeWidth = 85;
        this.gap = 200;
        this.impactPosition = [[65,-75], [-225,365], [-515,655]];//

        //this.setScore();
    }
    getPosition(){//获得bird位置、两个装 pipe的div 的marginLeft
        let birdPosition = { x:this.x, y:this.y };
        let pipesPosition = [];
        for(let i of [...this.allPipes].keys()){
            pipesPosition.push([
                parseInt(this.css(this.allPipes[i].getElementsByClassName('top')[0]).height),
                parseInt(document.getElementsByClassName(i<3?'pipes':'pipesCopy')[0].style.marginLeft)
            ]);
        }
        //console.log(birdPosition,pipesPosition);
        return {bird : birdPosition, pipes : pipesPosition};
    }
    setScore(){
        return setInterval(()=>{
            for(let key of n.keys()){
                n[key].style.backgroundPosition = `${key==0? this.n1:key==1?this.n2:this.n3 }px`;
            }
        },500);
    }
    watcher(){
    }
}



//DOM构建完成开始执行
document.addEventListener("DOMContentLoaded",function() {
    console.log(String.fromCharCode(...[37,99,32,26080,32842,24471,19968,21305,46,46,46]),'color:red');
    let b = new birds();
    b.fly();
    let f = new floor();
    let p = new pipe();

    let elements = {
        logo: document.getElementsByClassName('logo')[0],
        bird: document.getElementsByClassName('bird')[0],
        start: document.getElementsByClassName('start')[0]
    }

    let gameReady = document.getElementsByClassName('gameReady')[0];
    elements.start.addEventListener('click', () => {//点击start
        for (let e of Object.values(elements)) {
            e.style.display = 'none';
        }
        gameReady.style.display = 'block';
    });

    gameReady.addEventListener('click', () => {//ready点击
        b.init();
        gameReady.style.display = 'none';
        elements.bird.style.display = 'block';
        p.pipesMove();

    })

    //设置控制器
    let ctrls = document.getElementsByClassName('ctrl');
    let values = document.getElementsByClassName('ctrlValue');
    for(let i = 0;i < ctrls.length; i++){
        ctrls[i].addEventListener('change',()=>{
            values[i].innerHTML = ctrls[i].value;
            switch (i){
                case 1:{
                    f.speed = ctrls[1].value;
                }
                case 2:{
                    p.speed = ctrls[2].value;
                }
                case 3:{
                    p.gap = ctrls[3].value;
                }
                case 4:{
                    for(let p of document.getElementsByClassName('pipe')){
                        p.style.marginLeft = p.style.marginRight = `${ctrls[4].value}px`;
                    }
                }
                default:break;
            }
        })
    }
})