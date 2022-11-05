(function () {
    let container = document.querySelector('.event');
    let yOffset = 0; //window.pageYOffset 변수(현재 스크롤값)
    let prevScrollHeight = 0; //현재 스크롤 위치보다 이전에 위치한 스크롤 섹션들의 높이값의 합
    let currentScene = 0; //현재 활성화된 씬(section)
    let enterNewScene = false;//새로운 섹션이 시작되는 순간 true
    let acc = 0.1;
    let delayedYOffset = 0;
    let rafId;
    let rafState;

    const sceneInfo = [
        { // 0
            type:'sticky',
            heightNum:7, //브라우저 높이의 배수 (heightNum x scrollHeight = 높이값)
            scrollHeight:0,
            objs: {
                container:document.querySelector('#sec--0'),
                messageA:document.querySelector('top__msg--slide li:nth-child(1)'),
                messageB:document.querySelector('top__msg--slide li:nth-child(2)'),
                messageC:document.querySelector('top__msg--slide li:nth-child(3)'),
                canvas: document.querySelector('#top__canvas--tape'),
                context: document.querySelector('#top__canvas--tape').getContext('2d'),
                videoImages: []
            },
            values: {
                videoImageCount: 210, // 이미지가 210장
                imageSequence: [0, 209, { start: 0, end: 0.85 }], // 이미지 인덱스 
                canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
            }
        },
        { // 1
            type:'normal',
            heightNum:4, //브라우저 높이의 배수 (heightNum x scrollHeight = 높이값)
            scrollHeight:0,
            objs: {
                container:document.querySelector('#sec--1'),
                
            },
            values: {
                
            }
        },
        { // 2
            type:'normal',
            heightNum:4, //브라우저 높이의 배수 (heightNum x scrollHeight = 높이값)
            scrollHeight:0,
            objs: {
                container:document.querySelector('#sec--2'),
                
            },
            values: {
                
            }
        },
        { // 3
            type:'normal',
            heightNum:4, //브라우저 높이의 배수 (heightNum x scrollHeight = 높이값)
            scrollHeight:0,
            objs: {
                container:document.querySelector('#sec--3'),
                
            },
            values: {
                
            }
        },
        { // 4
            type:'normal',
            heightNum:4, //브라우저 높이의 배수 (heightNum x scrollHeight = 높이값)
            scrollHeight:0,
            objs: {
                container:document.querySelector('#sec--4'),
                
            },
            values: {
                
            }
        },
        { // 5
            type:'normal',
            heightNum:4, //브라우저 높이의 배수 (heightNum x scrollHeight = 높이값)
            scrollHeight:0,
            objs: {
                container:document.querySelector('#sec--5'),
                
            },
            values: {
                
            }
        },
    ];

    function setCanvasImages() {
        let imgElem;
        for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
            imgElem = new Image();
            imgElem.src = `./images/top/top-${i}.jpg`;

            sceneInfo[0].objs.videoImages.push(imgElem);
        }
    }

    function setLayout() { // 각 스크롤 섹션의 높이 세팅
        for(var i = 0; i < sceneInfo.length; i++){
            if(sceneInfo[i].type === 'sticky'){
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
                sceneInfo[i].objs.container.style.height = sceneInfo[i].scrollHeight + "px";
            } 
            else if(sceneInfo[i].type === 'normal'){
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
                sceneInfo[i].objs.container.style.height = "auto";
            }
            
        }

        var yOffset = window.pageYOffset;
        var totalScrollHeight = 0;
        for(var i= 0 ; i < sceneInfo.length; i++){ //새로고침시 현재 스크롤 위치찾기
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if(totalScrollHeight >= yOffset){
                currentScene = i;
                break;
            }
        }
        container.setAttribute('id', "scene-" + currentScene);

        if(window.innerWidth < 1280){
            const heightRatio = window.innerHeight / 720;

            sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        } else{
            const heightRatio = window.innerWidth / 1280;

            sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        }
        
    }

    function calcValues(values, currentYOffset){ // 현재 섹션에서의 스크롤 위치
        let rv;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight; //현재 섹션에서 스크롤 된 범위를 비율로 구하기

        if(values.length === 3){ // start ~ end 사이에 애니메인션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd){
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0]; // (이전 섹션 스크롤값 - 현재섹션 스크롤 시작값) / 현재섹션 총 스크롤 값 * 현재 섹션의 현재 스크롤 위치(비율)
            } else if(currentYOffset < partScrollStart){
                rv = values[0];
            } else if(currentYOffset > partScrollEnd){
                rv = values[1];
            }
        } else{
            rv = scrollRatio * (values[1] - values[0] + values[0]);//현재 섹션의 스크롤 위치(비율)
        }
        return rv;
    }

    function playAnimation() {
        var objs = sceneInfo[currentScene].objs; //현재 섹션의 objs
        var values = sceneInfo[currentScene].values; //현재 섹션의 values
        var currentYOffset = yOffset - prevScrollHeight; //현재 스크롤값 - 이전 섹션 스크롤값
        var scrollHeight = sceneInfo[currentScene].scrollHeight;
        var scrollRatio = currentYOffset / scrollHeight; // currentYOffset /현제 섹션의 scrollHeight
        
        switch(currentScene){ //현재 섹션에게만 이벤트
            case 0:
                // let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence], 0, 0);

                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                break;

            case 1:
                break;

            case 2:
                break;

            case 3:
                break;
        }
    }
    
    function scrollLoop() { //현재 섹션 구하기
        enterNewScene = false;
        prevScrollHeight = 0;

        for(var i= 0 ; i < currentScene; i++){
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
            enterNewScene = true;
            currentScene++;
            container.setAttribute('id', "scene-" + currentScene);
        }

        if(yOffset < prevScrollHeight){
            enterNewScene = true;
            if(currentScene === 0){
                return;
            }
            currentScene--;
            container.setAttribute('id', "scene-" + currentScene);
        }

        if(enterNewScene) {
            return;
        }

        playAnimation();
    }

    function loop() { //캔버스 이미지 드로우 부드럽게
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

        if (!enterNewScene) { //섹션 교차시점이 아닌 경우
            if (currentScene === 0 || currentScene === 2) { //첫번째 세번째만 컨버스 이미지 드로우
                const currentYOffset = delayedYOffset - prevScrollHeight;
                const objs = sceneInfo[currentScene].objs;
                const values = sceneInfo[currentScene].values;
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                if (objs.videoImages[sequence]) {
                    objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                }
            }
        }

        rafId = requestAnimationFrame(loop);

        if (Math.abs(yOffset - delayedYOffset) < 1) {
            cancelAnimationFrame(rafId);
            rafState = false;
        }
    }
    
    
    window.addEventListener('load', function(){
        setLayout();

        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0); //스크롤 하기전 로드후 캔버스 이미지 드로운

        let tempYOffset = yOffset;
        let tempScrollCount = 0;
        if (yOffset > 0) {
            let siId = setInterval(() => { //새로고침시 스크롤 강제실행(이미지오류)

                window.scrollTo(0, tempYOffset);
                tempYOffset += 1;

                if (tempScrollCount > 10) {
                    clearInterval(siId);
                }
                tempScrollCount++;
            }, 20);
        }

        window,addEventListener('scroll', function(){
            yOffset = window.pageYOffset;
            scrollLoop();

            if (!rafState) {
                rafId = requestAnimationFrame(loop);
                rafState = true;
            }
        });

        window.addEventListener('resize', function(){
            setLayout();
        });
    });
    

    setCanvasImages();
})();