# Puzzle 拼图游戏
## 实现原理
### **1.如何切图？**
用之前的方法就是使用photoshop将图片切成相应大小的图片。这种做法不灵活，如果要更换图片的话，就得重新去切图，很麻烦。
现在是使用canvas，图片是一整张jpg或者png，把图片导入到canvas画布，然后再调用上下文context的getImageData方法，把图片处理成小图，这些小图就作为拼图的基本单位
```
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
```
### **2.如何判断游戏是否结束?**
在刚刚生成的小图上面添加自定义属性 ， 后期在小图被移动后再一个个判断，如果顺序是对的，那么这张大图就拼接成功， 允许进入下一关；
```
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
```

### **3.如何实现小图片随机排列？**
使用math.random
```
 randomImg: function () {
             this.imgArr.sort(function () {
                 return Math.random() - Math.random();
             });
         },
```
### **4.拖拽功能实现？**
```
//监听dragstart设置拖拽数据
            on(contain, 'dragstart', function (e) {
                var target = getTarget(e);

                if (target.tagName.toLowerCase() == "img") {
                    e.dataTransfer.setData('id', e.target.id);
                }
            });

            on(contain, 'drop', function (ev) {
                var target = getTarget(ev);
　　　　　　　　//交换图片
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
```
核心代码和思路就是上面这些

