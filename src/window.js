var Content = {
    props:{
        com:Object
    },
    mounted:function(){
        this.$emit("created",this.$refs.content);
    },
    render: function (createElement)  {
        //应该判断是否为字符字符串
        return createElement(this.com,{
            ref:"content"
        });
    }
}


var Window = {
    props:{
        win:Object
    },
    computed:{
        title:function(){
            return this.win.title?this.win.title:"";
        },
        size:function(){
            var width  = this.win.width?this.win.width:500;
            var height = this.win.height?this.win.height:300;
            return {width:width,"max-width":width,height:height,"max-height":height};
        },
        cHeight:function(){
            var     height = this.win.height?this.win.height:300;
            height =  height - 60- 70;
            return height;
        }
    },
    methods:{
        ok:function(){
            //调用组件的函数
            if(this.content["ok"]){
               this.content["ok"]();
            }
            this.$emit('ok');
        },
        cancel:function(){
            //调用组件的函数
            if(this.content["cancel"]){
                this.content["cancel"]();
            }
            this.$emit('cancel');
        },
        //内容初始化完成
        created:function(content){
            this.content = content;
        }
    },
    components: {
        "content-com":Content
    },
    template:
        '<div class="modal-dialog" :style="size" >\
            <div class="modal-content">\
                <div class="modal-header">\
                    <h5 class="modal-title">{{title}}</h5>\
                    <button @click="cancel" type="button" class="close" data-dismiss="modal" aria-label="Close">\
                        <span aria-hidden="true">&times;</span>\
                    </button>\
                </div>\
                <div class="modal-body" :style="{height:cHeight}" >\
                   <content-com @created="created" :com="win.com"></content-com>\
                </div>\
                <div class="modal-footer">\
                    <button @click="cancel" type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>\
                    <button @click="ok" type="button" class="btn btn-primary">确定</button>\
                </div>\
            </div>\
        </div>'
    }

var WindowContainer = {
    data: function () {
        return {
          windows:[]
        }
    },
    methods:{
        open: function(win){
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
    template:
            '<div>\
                <template v-for="win in windows">\
                    <window @ok="ok(win)" @cancel="cancel(win)" :win="win"></window>\
                <template>\
             </div>'
}

export var WindowPlugin = {
    install:function(Vue, options){
        var WindowContainerComp = Vue.extend(WindowContainer);
        var win = new WindowContainerComp().$mount();
        document.body.appendChild(win.$el);

        Vue.WindowContainerComp = win;

        Vue.prototype.$openWindow = function (window) {
            Vue.WindowContainerComp.open(window);
        }
    }
}