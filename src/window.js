var Content = {
    props:{
        com:Object,
        //传递参数
        winProps:Object
    },
    mounted:function(){
        this.$emit("created",this.$refs.content);
    },
    render: function (createElement)  {
        //应该判断是否为字符字符串
        var p = {
            ref:"content"
        };
        if(this.winProps){
            p.props= this.winProps;
        }
        return createElement(this.com,p);
    }
}


var Window = {
    data:function(){
        return{
            left:0,
            top:0,
            DefaultWidth:500
        }
    },
    props:{
        win:Object
    },
    created:function(){
      var width  = this.win.width?this.win.width:this.DefaultWidth;
      //默认窗口居中
      this.left = this.win.left? this.win.left : (document.body.clientWidth / 2 - width / 2) - (document.body.scrollWidth - document.body.clientWidth );
      //默认可视区 10%
      this.top  = this.win.top? this.win.top : document.body.clientHeight /10 + document.body.scrollTop;
    },
    computed:{
        title:function(){
            return this.win.title?this.win.title:"";
        },
        size:function(){
            var width  = this.win.width?this.win.width:this.DefaultWidth;
            return {width:width,"max-width":width, left:this.left,top:this.top,position:"absolute",margin:"0"};
        },
        /**
         * 如果不设置高度，conten 中组件的高度为自适应
         * @returns 
         */
        cHeight:function(){
            if(this.win.height){
                // 如果不显示 header 就不需要减去 header 的值
                // 如果不显示 footer 就不需要减去 footer 的值
                return this.win.height - (this.header? 60 : 0) - (this.footer? 70 : 0);
            }
            return "auto";
        },
        footer:function(){
            if(typeof(this.win.footer) == "undefined" ||typeof(this.win.footer) != "boolean"){
                return true;
            }
            return this.win.footer;
        },
        header:function(){
            if(typeof(this.win.header) == "undefined" ||typeof(this.win.header) != "boolean"){
                return true;
            }
            return this.win.header;
        }
    },
    methods:{
        ok:function(){
            //调用组件函数
            if(this.win.ok &&  typeof(this.win.ok) === "function"){
                //参数为内部组件
                this.win.ok.call(null,this.content);
            }
            //调用组件的函数
            if(this.content["ok"]){
               this.content["ok"]();
            }
            this.$emit('ok');
        },
        cancel:function(){
            //调用组件函数
            if(this.win.cancel &&  typeof(this.win.cancel) === "function"){
                //参数为内部组件
                this.win.cancel.call(null,this.content);
            }

            //调用组件的函数
            if(this.content["cancel"]){
                this.content["cancel"]();
            }
            this.$emit('cancel');
        },
        //内容初始化完成
        created:function(content){
            this.content = content;
            //console.log(this.win.props);
        }
    },
    components: {
        "content-com":Content
    },
    template:
        '<div class="modal-dialog" :style="[size,{zIndex:win.zindex}]" >\
            <div class="modal-content">\
                <div v-if="header" class="modal-header">\
                    <h5 class="modal-title">{{title}}</h5>\
                    <button @click="cancel" type="button" class="close" data-dismiss="modal" aria-label="Close">\
                        <span aria-hidden="true">&times;</span>\
                    </button>\
                </div>\
                <div class="modal-body" :style="{height:cHeight}" >\
                   <content-com @created="created" :com="win.com" :winProps="win.props"></content-com>\
                </div>\
                <div v-if="footer" class="modal-footer">\
                    <button @click="cancel" type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>\
                    <button @click="ok" type="button" class="btn btn-primary">确定</button>\
                </div>\
            </div>\
        </div>'
    }

var WindowContainer = {
    data: function () {
        return {
          windows:[],
          mStyle:{height: "100%",width:"100%",position:"fixed",left:0,top:0,backgroundColor:"#9d9d9d",opacity: 0.5},
          //起始zindex
          zindex:2000,
          //css 无法解决滚动条问题，使用脚本控制
          mHeight:0,
          mWidth:0
        }
    },
    methods:{
        modalZindex(){
            var index = -1;
            for(var i=0 ; i< this.windows.length ; i++){
                if(this.windows[i].modal && this.windows[i].zindex > index){
                    index = this.windows[i].zindex-1;
                }
            }
            return index;
        },
        open: function(win){
            //间隔给 Modal 留位置
            this.zindex += 2;
            win.zindex  = this.zindex; 
            this.windows = this.windows.concat(win);
        },
        ok:function(win){
            this.delete(win);
        },
        cancel:function(win){
            this.delete(win);
        },
        //删除window
        delete:function(win){
           for(var i =0; i< this.windows.length; i++){
             if(this.windows[i] == win){
                this.windows.splice(i, 1);
                this.windows = this.windows.concat([]);
                break;
             }
           }
        }
    },
    
    components:{
        "window":Window
    },
    ////zindex loadding > message > model 2000 
    template:
            '<div style="position:absolute;left:0px;top:0px">\
                <div v-if="modalZindex() > 0" :style="[mStyle,{zIndex:modalZindex()}]"></div>\
                <template v-for="win in windows">\
                    <window @ok="ok(win)" @cancel="cancel(win)" :win="win"></window>\
                <template>\
             </div>'
}
/**
 * window 属性
 * ----------------
 *  title：标题
 *  width：宽度
 *  height: 高度
 *  left: 位置信息
 *  top:  位置信息
 *  com：组件
 *  props:传递参数
 *  header：是否显示 header，默认为 true
 *  footer：是否显示 footer，默认为 true
 *  ok：内部组件可以实现此方法，或者使用回调
 *  cancel：内部组件可以实现此方法，或者使用回调
 */
export var WindowPlugin = {
    install:function(Vue, options){
        var WindowContainerComp = Vue.extend(WindowContainer);
        var win = new WindowContainerComp().$mount();
        document.body.appendChild(win.$el);

        Vue.WindowContainerComp = win;

        Vue.prototype.$openWindow = function (window) {
            Vue.WindowContainerComp.open(window);
        }

        Vue.prototype.$win = { 
            //打开window
            open: function (window) {
               Vue.WindowContainerComp.open(window);
            }
        }
    }
}
