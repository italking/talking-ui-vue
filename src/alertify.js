var Confirm = {
    props: {
        confirm:{}
    },
    methods:{
        close:function(){
            if(this.confirm.cancel){
                this.confirm.cancel();
            }
            this.$emit('close');
        },
        ok:function(){
            if(this.confirm.ok){
                this.confirm.ok();
            }
            this.$emit('close');
        }
    },
    template: 
     '<div style="display:block;background-color:rgba(157, 157, 157,0.5);position:fixed;left:0;top:0;height:100%;width:100%">\
        <div class="modal-dialog">\
            <div class="modal-content">\
            <div v-if="confirm.showHeader" class="modal-header">\
                <h5 class="modal-title">{{confirm.title}}</h5>\
                <button type="button" class="close" @click="close" >\
                    <span aria-hidden="true">&times;</span>\
                </button>\
            </div>\
            <div class="modal-body">\
                {{confirm.message}}\
            </div>\
            <div class="modal-footer">\
                <button type="button" class="btn btn-secondary" @click="close" >取消</button>\
                <button type="button" class="btn btn-primary" @click="ok" >确定</button>\
            </div>\
            </div>\
       </div>\
     </div>'
}

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
          messages:[],
          currentConfirm:null,
          confirms:[]
        }
    },
    components:{
        alertify:Alertify,
        confirm:Confirm
    },
    methods:{
        //如果设置了时间可以自动关闭
        notify:function(message){
            if(message.time){
                this.setTimeout(message);
            }
            this.messages = this.messages.concat(message);
        },
        confirm:function(confirm){
            this.confirms.push(confirm);
            this.nextConfirm();
        },
        //处理下一个 confirm 
        nextConfirm:function(){
            if(this.currentConfirm === null && this.confirms.length > 0){
                this.currentConfirm = this.confirms.pop();
            }
        },
        closeConfirm:function(){
            this.currentConfirm = null;
            this.nextConfirm();
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
        '<div>\
            <confirm v-if="currentConfirm" @close="closeConfirm()" :confirm="currentConfirm"></confirm>\
            <div style="width:600px;position:fixed !important; right: 4px; top: 10px">\
                <template v-for="message in messages">\
                    <alertify @close="close(message)" :message="message"></alertify>\
                <template>\
            </div>\
         </div>'
}
/**
 * Message
 * 
 * level: 等级 3 成功 2 警告 1 危险
 * message：消息内容
 * time：自动关闭等待时间，毫秒
 * closeable：是否支持手动关闭
 * 
 * -----
 * Confirm
 * showHeader:显示头
 * title：标题
 * message：消息内容
 * ok：确认函数
 * cancle：取消函数
 * 
 * 
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

        Vue.prototype.$alertify = {
            message:function(message){
                Vue.AlertifyContainerComp.notify(message);
            },
            confirm:function(confirm){
                Vue.AlertifyContainerComp.confirm(confirm);
            }
        }
    }
}