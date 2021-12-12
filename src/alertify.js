var Alertify = {
    props: {
          message:null
    },
    methods:{
        close:function(){
            this.$emit('close');
        }
    },
    computed:{
        mainClass:function(){
            var clazz = ["alert","alert-dismissible"];
            if(!this.message.level ||this.message.level == 3){
                clazz.push("alert-success");
            }else if(this.message.level == 2){
                clazz.push("alert-warning");
            }else if(this.message.level == 1){
                clazz.push("alert-danger");
            }
            return clazz;
        },
        closeable:function(){
            if(typeof(this.message.closeable) == "undefined"){
                return true;
            }
            return this.message.closeable;
        }
    },
    template:
        '<div :class="mainClass">\
           {{message.message}}\
            <button v-if="closeable" type="button" class="close" @click="close" >\
                <span>&times;</span>\
            </button>\
        </div>'
}

var AlertifyContainer = {
    data: function () {
        return {
          messages:[]
        }
    },
    components:{
        alertify:Alertify
    },
    methods:{
        //如果设置了时间可以自动关闭
        notify:function(message){
            if(message.time){
                this.setTimeout(message);
            }
            this.messages = this.messages.concat(message);
        },
        close(message){
            this.delete(message);
        },
        //删除 message
        delete:function(message){
            for(var i =0; i< this.messages.length; i++){
              if(this.messages[i] == message){
                 this.messages.splice(i, 1);
                 this.messages = this.messages.concat([]);
                 break;
              }
            } 
         },
         setTimeout:function(message){
            var self  =  this;
            window.setTimeout(()=>{
                self.delete(message);
            },message.time);
         }
    },
    //zindex loadding > message > model
    template:
        '<div style="width:600px;z-index: 5555; position:fixed !important; right: 0px; top: 0px;">\
            <template v-for="message in messages">\
                <alertify @close="close(message)" :message="message"></alertify>\
            <template>\
         <div>'
}
/**
 * level: 等级 3 成功 2 警告 1 危险
 * message：消息内容
 * time：自动关闭等待时间，毫秒
 * closeable：是否支持手动关闭
 */
export var AlertifyPlugin = {
    install:function(Vue, options){
        var AlertifyContainerComp = Vue.extend(AlertifyContainer);
        var alertify = new AlertifyContainerComp().$mount();
        document.body.appendChild(alertify.$el);

        Vue.AlertifyContainerComp = alertify;

        Vue.prototype.$notify = function (message) {
            Vue.AlertifyContainerComp.notify(message);
        }
    }
}