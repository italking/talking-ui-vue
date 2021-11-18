var Window = {
    props:{
        win:Object
    },
    template:
        '<div class="modal-dialog">\
            <div class="modal-content">\
                <div class="modal-header">\
                    <h5 class="modal-title">Modal title</h5>\
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
                    <span aria-hidden="true">&times;</span>\
                    </button>\
                </div>\
                <div class="modal-body">\
                    <p>Modal body text goes here.</p>\
                </div>\
                <div class="modal-footer">\
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>\
                    <button type="button" class="btn btn-primary">Save changes</button>\
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
        openWindow: function(window){
            windows.push(window);
        }
    },
    template:
            '<template v-for="win in windows">\
                <window :win="win"></window>\
             <template>'
}

export var WindowPlugin = {
    install:function(Vue, options){
        var WindowContainerComp = Vue.extend(WindowContainer);
        var WindowContainerComp = new WindowContainer().$mount('#body');
        Vue.WindowContainerComp = WindowContainerComp;

        Vue.prototype.$openWindow = function (window) {
            Vue.WindowContainerComp.open(window);
        }
    }
}