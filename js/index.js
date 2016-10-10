var image = new Image();

image.src = 'img/shulan.jpg';

image.onload = function () {
    randomImg();
    renderImg(image);
    drag();
};

//获取canvas的context对象
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

//获取数组列表,将类数组变成数组
var imgLikeArr = document.querySelectorAll('img');
var imgArr = Array.prototype.slice.call(imgLikeArr);
var divContext = document.querySelectorAll('#game div');

//利用canvas切出小块图片
function renderImg(image) {
    var index = 0;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            context.drawImage(image, 300 * j, 300 * i, 300, 600, 0, 0, 300, 300);
            imgArr[index].src = canvas.toDataURL('image/jpeg');
            imgArr[index].id = index;
            index++;
        }
    }
}

//实现小块图片的随机排序
function randomImg() {
    imgArr.sort(function (a, b) {
        return Math.random() - Math.random();
    });
}

//拖拽效果
function drag() {
    var i, len = imgArr.length;
    for (i = 0; i < len; i++) {
        var cache;
        imgArr[i].ondragstart = function (ev) {
            cache = ev.target.id;
        };
        if (!!divContext[i]) {
            divContext[i].ondrop = function (ev) {
                ev.preventDefault();
                var originObj = document.getElementById(cache);
                var origin = {
                    'src': originObj.src,
                    'id': originObj.id
                };
                var endObj = ev.target;
                if(ev.target.querySelector('img')){
                    endObj = ev.target.querySelector('img');
                }

                var end = {
                    'src': endObj.src,
                    'id': endObj.id
                }
                originObj.src = end.src;
                originObj.id = end.id;

                endObj.src = origin.src;
                endObj.id = origin.id;
                if (origin.id != end.id) {
                    changestep();
                }
                isSuccess();

            };
            divContext[i].ondragover = function (ev) {
                ev.preventDefault();
            };

        }
    }
}

//遮罩层
function showtip() {
    var hint = document.querySelector('.hint');
    hint.classList.toggle('hide');
}

//改变步数
function changestep() {
    var step = document.getElementById('step');
    step.innerText = +step.innerText + 1;
}

//判断游戏是否完成
function isSuccess() {
    var imgLikeArr = document.querySelectorAll('img');
    var imgArr = Array.prototype.slice.call(imgLikeArr);
    var len = imgArr.length, i = 0;

    while (i < len) {
        var idx = imgArr[i].id;
        if (i == idx) {
            i++;
        } else {
            break;
        }
    }
    if (i >= len) {
        setTimeout(function () {
            showtip();
        }, 200);
    }
}


document.getElementById('next').onclick = function (e) {
    var image1 = new Image();
    image1.src = 'img/test.jpg';
    image1.onload = function () {
        randomImg();
        renderImg(image1);
        drag();
    };
    showtip();
    document.getElementById('step').innerText = 0;
}