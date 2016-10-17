/**
 * @author beidan
 * @description 拼图小游戏
 */
;(function () {
    function Puzzle() {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');

        this.imgLikeArr = document.querySelectorAll('img');
        this.imgArr = Array.prototype.slice.call(this.imgLikeArr);
    }

    Puzzle.prototype = {
        init: function (url) {
            var image = new Image(), self = this;
            image.src = url;

            image.onload = function () {
                self.randomImg();
                self.renderImg(image);
                self.dragEvent();
            };
        },

        //canvas绘制图片
        renderImg: function (image) {
            var index = 0;
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    this.context.drawImage(image, 300 * j, 300 * i, 300, 600, 0, 0, 300, 300);
                    this.imgArr[index].src = this.canvas.toDataURL('image/jpeg');
                    this.imgArr[index].id = index;
                    index++;
                }
            }
        },
        //监听事件
        dragEvent: function () {
            var contain = document.getElementById('game'),
                next = document.getElementById('next'),
                self = this;

            //监听dragstart设置拖拽数据
            on(contain, 'dragstart', function (e) {
                var target = getTarget(e);

                if (target.tagName.toLowerCase() == "img") {
                    e.dataTransfer.setData('id', e.target.id);
                }
            });

            on(contain, 'drop', function (ev) {
                var target = getTarget(ev);

                if (target.tagName.toLowerCase() == "img") {
                    var originObj = document.getElementById(ev.dataTransfer.getData('id'));
                    var cache = {
                        'src': originObj.src,
                        'id': originObj.id
                    };
                    var endObj = ev.target.querySelector('img') || ev.target;

                    originObj.src = endObj.src;
                    originObj.id = endObj.id;
                    endObj.src = cache.src;
                    endObj.id = cache.id;

                    if (originObj.id != endObj.id) {
                        self.changestep();
                    }

                    self.isSuccess();
                }
            });

            //取消浏览器默认行为使元素可拖放.
            on(contain, 'dragover', function (ev) {
                ev.preventDefault();
            });

            on(next, 'click', function (ev) {
                self.init('img/test.jpg');
                self.showtip();
                document.getElementById('step').innerText = 0;
            });

        },
        //实现小块图片的随机排序
        randomImg: function () {
            this.imgArr.sort(function () {
                return Math.random() - Math.random();
            });
        },
        //遮罩层
        showtip: function () {
            var hint = document.querySelector('.hint');
            hint.classList.toggle('hide');
        },
//改变步数
        changestep: function () {
            var step = document.getElementById('step');
            step.innerText = +step.innerText + 1;
        },
//判断游戏是否完成
        isSuccess: function () {
            var imgLikeArr = document.querySelectorAll('img'),
                imgArr = Array.prototype.slice.call(imgLikeArr),
                len = imgArr.length, i,
                flag = true, self = this;

            for (i = 0; i < len; i++) {
                if (imgArr[i].id != i) {
                    flag = false;
                }
            }

            if (flag) {
                setTimeout(function () {
                    self.showtip();
                }, 200);
            }
        }
    };

    //事件代理
    function on(ele, type, handler) {
        if (ele.addEventListener) {
            return ele.addEventListener(type, handler, false);
        } else if (ele.attachEvent) {
            return ele.attachEvent('on' + type, function () {
                handler.call(ele);
            });
        } else {
            return ele['on' + type] = handler;
        }
    }

    function getTarget(e) {
        var getEvent = e || window.event;
        return getEvent.target || getEvent.srcElement;
    }


//调用
    var puzzle = new Puzzle();
    puzzle.init('img/shulan.jpg');

})();




