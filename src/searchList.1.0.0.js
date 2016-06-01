define(function(require, exports, module){
    var $      = require( '$' ),
    Handlebars = require( 'handlebars' ),
    searchList = {
        /**
        * 初始化
        */
        init: function( options ){
            this.options = options;
            this.eles = $( this.options.eles );
            
            // 搜索 过滤 关键字
            this.f_kw = '';
            
            // 获取列表模板
            this.listTpl = $( this.options.tpl ).html( );
            
            // 标签初始化
            this.eleInit();
            
            // 关键字 搜索
            this.search();
            
            // 搜索结果 过滤
            this.options.filter && this.filter();
            
            return this.eles;
        },
        /**
        * 标签 初始化
        */
        eleInit: function(){
            var This = this;
            this.eles.each(function(){
                var $this = $( this ), _H = $this.outerHeight( true ), Html = '';
                
                // 是否keyup事件 搜索
                Html += This.options.keydown ? '<i class="kuma-icon kuma-icon-search" style="display:none;"></i>' : '<i class="kuma-icon kuma-icon-search"></i>';
                
                // 是否开始搜索结果 过滤功能
                Html += This.options.filter ? '<div class="dropDownBox" style="top:'+(_H+2)+'px"><p class="filterBox"><input type="text" class="cin-filter"></p><ul></ul></div>' : '<div class="dropDownBox" style="top:'+(_H+2)+'px"><ul></ul></div>';

                $( this ).append( Html );
            });
        },
        /**
        * mvc
        */
        MVC: function( tpl ){
            var This = this;
            Handlebars.registerHelper('filter', function( val ){
                
                if( This.f_kw.length ){
                    var regexp = new RegExp( This.f_kw, 'mg' );
                    return val.replace( regexp, function(a,b,c,d){return '<span class="kw">'+a+'</span>'} );
                }else{
                    return val;
                }
                
            });
            return Handlebars.compile( tpl );
            
        },
        /**
        *   关键字 搜索
        */
        search: function(){
            
            var This         = this,
                getTplObj    = This.listTpl.match( '{{#each (.+)}}', 'i' )[ 1 ];
                
            This.eles.on('click', '.kuma-icon-search', function(){
                
                var $this    = $( this ),
                searchBox    = $this.closest( '.searchList' ),
                oinput       = searchBox.find('.cin-keyword'),
                kw           = $.trim( oinput.val() ),
                dropDown     = searchBox.find('.dropDownBox'),
                HtmlList     = '',
                _O           = {};
                
                _O[ oinput.attr('name') ] = kw;
                _O        = $.extend( This.options.param, _O );
                _O[ '_' ] = new Date().getTime();
                
                $('.searchList').find('.dropDownBox').hide();
                This.f_kw = '';
                
                if( kw ){
                    $.getJSON( This.options.portUrl, _O, function( data ){
                        
                        HtmlList = This.MVC( This.listTpl )( data );
                        
                        // 填充html标签内容，同时缓存列表的数据供过滤操作时使用
                        dropDown.find('ul').html( HtmlList ).data('cacheListData',{listData: data, listArr: eval( '(data.'+getTplObj+')' ), cacheArrStr: JSON.stringify( eval( '(data.'+getTplObj+')' ) )});
                        
                        HtmlList && dropDown.show();
                        
                        
                    });
                }
                
            });
            
            This.eles.find('.cin-keyword').on('keyup', function( ev ){
                ev = ev || event;
                
                // 开户 keyup 事件搜索
                var keyCode = ev.keyCode || ev.which || ev.charCode,
                Enter = keyCode === 13,
                NO_Key = keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40 || keyCode === 16 || keyCode === 17 || keyCode === 18;
                
                if( This.options.keydown && !Enter && !NO_Key ){
                    
                    $( this ).closest( This.options.eles ).find('.kuma-icon-search').trigger('click');
                    
                }else if( Enter && !This.options.keydown ){
                    
                    $( this ).closest( This.options.eles ).find('.kuma-icon-search').trigger('click');
                    
                }
            });
            
            
            This.eles.on('click', function( ev ){
                ev.stopPropagation();
            });
            
            $(document).on('click', function(){
                
                $('.searchList').find('.dropDownBox').hide();
                
            });
            
        },
        /**
        *
        *   过滤 搜索
        *
        */
        filter: function(){
            
            var This     = this,
            getTplObj    = This.listTpl.match( '{{#each (.+)}}', 'i' )[ 1 ],
            value        = This.listTpl.match( '>{{{filter (.+)}}}</a>', 'i' )[ 1 ];
            
            This.eles.find('.cin-filter').on('keyup', function(){
                
                var $this  = $( this ),
                dropDown   = $this.closest('.dropDownBox'),
                dropDownUl = dropDown.find('ul'),
                lis        = dropDownUl.find('li');
                
                var cacheData = dropDownUl.data( 'cacheListData' ),
                listData      = cacheData.listData,
                cacheArrStr   = cacheData.cacheArrStr,
                listArr       = cacheData.listArr;
                
                kw            = $.trim( $( this ).val() );
                
                var tranObj   = $.parseJSON( cacheArrStr );
                
                if( kw.length>0 ){
                    /*
                        思维要开扩，静思其想
                    */
                    listArr.length = 0;
                    
                    This.f_kw      = kw;
                    
                    $.each( tranObj, function(i, val){
                        var itemVal = val[ value ];
                        var regexp  = new RegExp( kw, 'mg' );
                        if( regexp.test(itemVal) ){
                            listArr.push( val );
                        }
                        
                    });
                    
                }else{
                    
                    listArr.length = 0;
                    $.each(tranObj, function(i, val){
                        listArr.push( val );
                    });
                    
                    This.f_kw = '';
                    
                }
                
                HtmlList = This.MVC( This.listTpl )( listData );
                
                dropDown.find('ul').html( HtmlList );
                HtmlList && dropDown.show();
                
            });
            
        }
    };
    module.exports = searchList;
});