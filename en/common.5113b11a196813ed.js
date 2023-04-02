"use strict";(self.webpackChunksplitexpenses=self.webpackChunksplitexpenses||[]).push([[592],{6938:(v,f,n)=>{n.d(f,{H:()=>T});var m=n(4155),E=n(2340),t=n(4650),e=n(3249);let T=(()=>{class p{constructor(i){this.storageService=i,this.bytype="false",this.data={labels:[""],data:[]},this.filter="",this.barChartOptions={responsive:!0,scales:{x:{stacked:!0},y:{min:0,stacked:!0}},plugins:{tooltip:{},legend:{display:!1},title:{display:!0,text:""}}},this.barChartType="bar",this.barChartPlugins=[],this.barChartData={labels:[],datasets:[{data:[],label:"",borderColor:"yellow",backgroundColor:["rgba(222,225,38,0.68)"]}]},this.settings=this.storageService.getSettings()}ngOnChanges(i){"ByType"===this.bytype?this.calcByType():"weather"===this.bytype?this.weatherChart():this.calcByDay(),this.chart?.update()}ngOnInit(){"ByType"===this.bytype?this.calcByType():"weather"===this.bytype?this.weatherChart():this.calcByDay()}chartClicked({active:o}){if("true"===this.bytype){let l=o?.pop();console.log(l),this.filter=l?E.N.expensesTypes[l.index]:""}}chartHovered({}){}calcByType(i){this.barChartData.datasets[0].label="",this.barChartOptions?.plugins?.title&&(this.barChartOptions.plugins.title.text="Gasto acumulado por tipo"),this.barChartData.datasets[0].backgroundColor=this.settings.graph.bgColors,this.barChartData.datasets[0].data=this.data.data,this.barChartData.labels=this.data.labels}calcByDay(){this.barChartOptions?.plugins?.title&&(this.barChartOptions.plugins.title.text="Daily expenses"),this.barChartData.datasets=this.data.data,this.barChartData.labels=this.data.labels.map(i=>new Date(i).toLocaleDateString("ES",{weekday:"short",day:"numeric"}))}weatherChart(){this.barChartData.labels=this.data.labels,this.barChartType="line",this.barChartData.datasets[0].data=this.data.data,this.barChartData.datasets[0].fill=!0,this.barChartOptions?.scales&&this.barChartOptions.scales.y&&(this.barChartOptions.scales.y.max=35),this.barChartOptions?.plugins?.title&&(this.barChartOptions.plugins.title.text="Forecast")}}return p.\u0275fac=function(i){return new(i||p)(t.Y36(e.g))},p.\u0275cmp=t.Xpm({type:p,selectors:[["app-summarygraph"]],viewQuery:function(i,o){if(1&i&&t.Gf(m.jh,5),2&i){let l;t.iGM(l=t.CRH())&&(o.chart=l.first)}},inputs:{bytype:"bytype",data:"data"},features:[t.TTD],decls:2,vars:4,consts:[[1,"mb-3"],["baseChart","",3,"data","options","plugins","type","chartHover","chartClick"]],template:function(i,o){1&i&&(t.TgZ(0,"div",0)(1,"canvas",1),t.NdJ("chartHover",function(r){return o.chartHovered(r)})("chartClick",function(r){return o.chartClicked(r)}),t.qZA()()),2&i&&(t.xp6(1),t.Q6J("data",o.barChartData)("options",o.barChartOptions)("plugins",o.barChartPlugins)("type",o.barChartType))},dependencies:[m.jh]}),p})()},3975:(v,f,n)=>{n.d(f,{J:()=>i});var m=n(5861),E=n(3905),t=n(2134),e=n(4650),T=n(7024),p=n(7009),h=n(4006);let i=(()=>{class o{constructor(r,d){this.userService=r,this._snackBar=d,this.toastmsg={OK:"Saved successfully",KO:"Fatal error",EXIST:"User already exists"},this.inputValue="",this.inputPhone="",this.users$=this.userService.getIterableUsers()}ngOnInit(){}clearInput(){this.inputValue="",this.inputPhone=""}add(r,d){var _=this;return(0,m.Z)(function*(){(yield(0,E.z)(_.userService.checkIfNameExist(r)))?(0,t.jW)(_._snackBar,t.dR.EXIST,_.toastmsg.EXIST):(_.userService.addUser({id:"",name:r,phone:d||""}),_.clearInput(),(0,t.jW)(_._snackBar,t.dR.OK,_.toastmsg.OK))})()}}return o.\u0275fac=function(r){return new(r||o)(e.Y36(T.f),e.Y36(p.ux))},o.\u0275cmp=e.Xpm({type:o,selectors:[["app-add-user"]],decls:11,vars:3,consts:function(){let l,r;return l="Users administration",r=" Add User",[[1,"my-4","text-center"],l,[1,"mb-2","row","g-4","users"],[1,"col-6"],["type","text","i18n.placeholder","","placeholder","Nombre usuario",1,"form-control",3,"ngModel","ngModelChange"],["user",""],["type","number","i18n.placeholder","","placeholder","whatsApp number (optional)",1,"form-control",3,"ngModel","ngModelChange"],["phone",""],["type","button",1,"input-group","btn","my-3","btn","btn-primary","p-2",3,"disabled","click"],r]},template:function(r,d){if(1&r){const _=e.EpF();e.TgZ(0,"h2",0),e.SDv(1,1),e.qZA(),e.TgZ(2,"div",2)(3,"div",3)(4,"input",4,5),e.NdJ("ngModelChange",function(C){return d.inputValue=C}),e.qZA()(),e.TgZ(6,"div",3)(7,"input",6,7),e.NdJ("ngModelChange",function(C){return d.inputPhone=C}),e.qZA()()(),e.TgZ(9,"button",8),e.NdJ("click",function(){e.CHM(_);const C=e.MAs(5),M=e.MAs(8);return e.KtG(d.add(C.value,M.value))}),e.SDv(10,9),e.qZA()}if(2&r){const _=e.MAs(5);e.xp6(4),e.Q6J("ngModel",d.inputValue),e.xp6(3),e.Q6J("ngModel",d.inputPhone),e.xp6(2),e.Q6J("disabled",""==_.value)}},dependencies:[h.Fj,h.wV,h.JJ,h.On]}),o})()},3563:(v,f,n)=>{n.r(f),n.d(f,{UsersModule:()=>A});var m=n(6895),E=n(284),t=n(4650),e=n(2134),T=n(7024),p=n(7009),h=n(4859);function i(s,c){if(1&s){const a=t.EpF();t.TgZ(0,"tr")(1,"td",5,6),t.NdJ("focusout",function(){const S=t.CHM(a).$implicit,g=t.MAs(2),b=t.oxw(2);return t.KtG(b.edit(g,S,"name"))}),t._uU(3),t.qZA(),t.TgZ(4,"td",5,7),t.NdJ("focusout",function(){const S=t.CHM(a).$implicit,g=t.MAs(5),b=t.oxw(2);return t.KtG(b.edit(g,S,"phone"))}),t._uU(6),t.qZA(),t.TgZ(7,"td",8),t.NdJ("click",function(){const S=t.CHM(a).$implicit,g=t.oxw(2);return t.KtG(g.delete(S.id))}),t.TgZ(8,"button",9)(9,"span",10),t._uU(10,"delete_forever"),t.qZA()()()()}if(2&s){const a=c.$implicit;t.xp6(3),t.hij(" ",a.name," "),t.xp6(3),t.hij(" ",a.phone,"")}}function o(s,c){if(1&s&&(t.TgZ(0,"table",1)(1,"thead")(2,"tr")(3,"th"),t.SDv(4,2),t.qZA(),t.TgZ(5,"th"),t.SDv(6,3),t.qZA(),t.TgZ(7,"th"),t._uU(8," - "),t.qZA()()(),t.TgZ(9,"tbody"),t.YNc(10,i,11,2,"tr",4),t.ALo(11,"async"),t.qZA()()),2&s){const a=t.oxw();t.xp6(10),t.Q6J("ngForOf",t.lcZ(11,1,a.users$))}}let l=(()=>{class s{constructor(a,u){this.userService=a,this._snackBar=u,this.toastmsg={OK:"Saved successfully",KO:"Fatal error",EXIST:"User already exists"},this.users$=this.userService.getIterableUsers()}ngOnInit(){}edit(a,u,U){let S=u[U];const g=a.innerText.trim();g&&S!=g?(u[U]=g,this.userService.editUser(u),(0,e.jW)(this._snackBar,e.dR.OK,this.toastmsg.OK)):a.innerText=S||""}delete(a){this.userService.removeUser(a),(0,e.jW)(this._snackBar,e.dR.OK,"Usuario borrado")}}return s.\u0275fac=function(a){return new(a||s)(t.Y36(T.f),t.Y36(p.ux))},s.\u0275cmp=t.Xpm({type:s,selectors:[["app-users-list"]],decls:1,vars:1,consts:function(){let c,a;return c="Name",a="Phone",[["class","table table-striped mt-4",4,"ngIf"],[1,"table","table-striped","mt-4"],c,a,[4,"ngFor","ngForOf"],["contentEditable","",3,"focusout"],["nameCell",""],["phoneCell",""],[3,"click"],["mat-mini-fab","","color","warn","aria-label","Example icon button with a filter list icon"],[1,"material-icons"]]},template:function(a,u){1&a&&t.YNc(0,o,12,3,"table",0),2&a&&t.Q6J("ngIf",u.users$)},dependencies:[m.sg,m.O5,h.nh,m.Ov]}),s})();var r=n(3975);const _=[{path:"",component:(()=>{class s{}return s.\u0275fac=function(a){return new(a||s)},s.\u0275cmp=t.Xpm({type:s,selectors:[["app-users"]],decls:3,vars:0,consts:[[1,"container"]],template:function(a,u){1&a&&(t.TgZ(0,"main",0),t._UZ(1,"app-add-user")(2,"app-users-list"),t.qZA())},dependencies:[l,r.J]}),s})()},{path:"list",component:l},{path:"add",component:r.J}];let y=(()=>{class s{}return s.\u0275fac=function(a){return new(a||s)},s.\u0275mod=t.oAB({type:s}),s.\u0275inj=t.cJS({imports:[E.Bz.forChild(_),E.Bz]}),s})();var C=n(4006),M=n(4466);let A=(()=>{class s{}return s.\u0275fac=function(a){return new(a||s)},s.\u0275mod=t.oAB({type:s}),s.\u0275inj=t.cJS({providers:[T.f],imports:[m.ez,y,p.ZX,C.u5,M.m]}),s})()}}]);