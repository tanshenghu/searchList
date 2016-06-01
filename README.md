## `searchList` By TanShenghu

<br>

>**该组件功能是我在支付宝-蚂蚁金服做外包时做写，当时我这边的工作已经完成趁空闲时间写了一个这种组件方法**
>**组件优点：1、一个页面可以多处使用该组件功能。2、提供了回车或点击放大镜搜索，也可边输入边搜索。3、可以在无需请求后端的情况之下，将最近搜索结果进行过滤操作(第3点是最大优点，性能优化、它同时解决前后端交互请求等待的时间)**

<br>

![模糊搜索-searchList](http://www.tanshenghu.com/widget/searchList/examples/1.png)
###模糊搜索

![结果过滤-searchList](http://www.tanshenghu.com/widget/searchList/examples/2.png)
###结果过滤

![按键搜索-searchList](http://www.tanshenghu.com/widget/searchList/examples/3.png)
###按键keydown搜索

[demo](http://www.tanshenghu.com/widget/searchList/examples/searchList.html)


## javascript


```javascript

seajs.use(['$','searchList'], function( $, SearchList ){
        
        SearchList.init({
            eles: '#test1', // 搜索组件外层box元素
            keydown: false, // 是否开启keydown按键形式搜索
            param: { // 搜索除了带关键字外，还可以带其它参数条件
                "page": 'test',
                "name": 'tsh'
            },
            tpl: '#tpl', // 列表模板
            filter: true, // 是否开启过滤功能
            portUrl: './data.json' // 后端数据接口地址
        })
        .find('.dropDownBox ul').on('click', 'a', function(){
            var $this   = $( this ),
            searchList  = $this.closest('.searchList'),
            oinput      = searchList.find('.cin-keyword'),
            dropDownBox = searchList.find('.dropDownBox');
            
            oinput.val( $this.text() ).attr( 'data-id', $this.attr('data-id') );
            dropDownBox.hide();
        });
        
    });

```


## html

```html

<span id="test1" class="searchList"><input type="text" name="name" class="cin-keyword"></span>
<script type="text/template" id="tpl">
{{#each content.data}}
<li title="{{name}}"><a href="javascript:;" data-id="{{id}}">{{{filter name}}}</a></li>
{{/each}}
</script>

```


### 完     The End