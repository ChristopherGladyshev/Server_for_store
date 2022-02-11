(()=>{var e={257:(e,t,r)=>{const s=r(94);e.exports=new class{async getProduct(e,t,r){try{const e=await s.getPosts();t.json(e)}catch(e){r(e)}}async getroduct(e,t,r){const{id:a}=e.body;try{const e=await s.getPost(a);t.json(e)}catch(e){r(e)}}async createroduct(e,t,r){const{title:a,description:n,post_text:o,author_id:i,email_author:c,images:u}=e.body;try{const e=await s.createPost(a,n,o,i,c,u);t.json(e)}catch(e){r(e)}}async deletePost(){}}},200:(e,t,r)=>{const s=r(966),{validationResult:a}=r(553),n=r(52),o=r(168);e.exports=new class{async registration(e,t,r){try{const o=a(e);if(!o.isEmpty())return r(n.BadRequest("Ошибка валидации",o.array()));const{email:i,password:c}=e.body,u=await s.registration(i,c);return t.cookie("refreshToken",u.refreshToken,{maxAge:2592e6,httpOnly:!0}),t.json(u)}catch(e){r(e)}}async login(e,t,r){try{const{email:r,password:a}=e.body,n=await s.login(r,a);return t.cookie("refreshToken",n.refreshToken,{maxAge:2592e6,httpOnly:!0}),t.json(n)}catch(e){r(e)}}async logout(e,t,r){try{const{refreshToken:r}=e.cookies,a=await s.logout(r);return t.clearCookie("refreshToken"),t.json(a)}catch(e){r(e)}}async activate(e,t,r){try{const r=e.params.link;return await s.activate(r),t.redirect(process.env.CLIENT_URL)}catch(e){r(e)}}async refresh(e,t,r){try{const{refreshToken:r}=e.cookies,a=await s.refresh(r);return t.cookie("refreshToken",a.refreshToken,{maxAge:2592e6,httpOnly:!0}),t.json(a)}catch(e){}}async getUser(e,t,r){const a=await e.query.id;try{const e=await s.getUser(a),r=await o.find({author:a});e.posts=r,t.json(e)}catch(e){r(e)}}async getUsers(e,t,r){try{const e=await s.getAllUsers();t.json(e)}catch(e){r(e)}}async updateUser(e,t,r){const{first_name:a,family_name:n,age:o,id:i}=e.body;try{const e=await s.updateUserProfile(a,n,o,i);t.json(e)}catch(e){r(e)}}}},125:e=>{e.exports=class{email;id;is_activated;constructor(e){this.email=e.email,this.id=e._id,this.is_activated=e.is_activated}}},52:e=>{e.exports=class e extends Error{status;errors;constructor(e,t,r=[]){super(t),this.status=e,this.errors=r}static UnauthorizedError(){return new e(401,"Пользователь не авторизован")}static BadRequest(t,r){return new e(400,t,r)}}},652:(e,t,r)=>{const s=r(52),a=r(594);e.exports=function(e,t,r){try{const t=e.headers.authorization;if(!t)throw s.UnauthorizedError();const n=t.split(" ")[1];if(!n)throw s.UnauthorizedError();const o=a.validateAccessToken(n);if(!o)throw s.UnauthorizedError();e.user=o,r()}catch(e){return r(s.UnauthorizedError())}}},223:(e,t,r)=>{const s=r(52);e.exports=function(e,t,r,a){return console.log(e),e instanceof s?r.status(e.status).json({massage:e.message,errors:e.errors}):r.status(500).json({message:"Непредвиденная ошибка сервера"})}},168:(e,t,r)=>{const{Schema:s,model:a}=r(185),n=new s({title:{type:String,max:100,required:!0},description:{type:String,max:200,required:!0},product_text:{type:String,required:!0},author:{type:s.Types.ObjectId,ref:"User"},price:{type:Number},email_author:{type:String,unique:!0},date_of_creation:{type:String,default:(new Date).toLocaleString("de-RU")},images:[String]});n.set("toObject",{virtuals:!0}),n.set("toJSON",{virtuals:!0}),n.virtual("url").get((function(){return`/product?id=${this._id}`})),e.exports=a("Post",n)},878:(e,t,r)=>{const{Schema:s,model:a}=r(185),n=new s({user:{type:s.Types.ObjectId,ref:"User"},refreshToken:{type:String,required:!0}});e.exports=a("Token",n)},645:(e,t,r)=>{const{Schema:s,model:a}=r(185),n=(r(168),new s({first_name:{type:String,max:100},family_name:{type:String,max:100},age:{type:String},email:{type:String,unique:!0,required:!0},password:{type:String,required:!0},is_activated:{type:Boolean,default:!1},activation_link:{type:String},update:{type:String,default:(new Date).toLocaleString("de-RU")},posts:[{type:s.Types.ObjectId,ref:"Post"}]}));n.set("toObject",{virtuals:!0}),n.set("toJSON",{virtuals:!0}),n.virtual("fullName").get((function(){if(this.first_name&&this.family_name)return`${this.first_name} ${this.family_name}`})),n.virtual("url").get((function(){return`/author?id=${this._id}`})),e.exports=a("User",n)},413:(e,t,r)=>{const s=r(860).Router,a=r(200),n=r(257),o=new s,{body:i}=r(553);r(652),o.post("/registration",i("email").isEmail(),i("password").isLength({min:3,max:32}),a.registration),o.post("/login",a.login),o.post("/logout",a.logout),o.get("/activate/:link",a.activate),o.get("/refresh",a.refresh),o.get("/user",a.getUser),o.get("/users",a.getUsers),o.post("/user/update",a.updateUser),o.get("/product",n.getProduct),e.exports=o},611:(e,t,r)=>{const s=r(184);e.exports=new class{constructor(){this.transporter=s.createTransport({host:process.env.SMTP_HOST,port:process.env.SMTP_PORT,secure:!0,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD}})}async sendActivationMail(e,t){await this.transporter.sendMail({from:process.env.SMTP_USER,to:e,subject:`Активация аккаунта на ${process.env.API_URL}`,text:"",html:`\n        <div>\n          <h1>Для активации перейдите по ссылке</h1>\n          <a href="${t}">${t}</a>\n        </div>\n      `})}}},94:(e,t,r)=>{const s=r(168),a=r(645),n=r(52);e.exports=new class{async createPost(e,t,r,o,i,c){if(!await a.findById(o))throw n.BadRequest(`Пользователь с id ${o} не существует`);return{success:!0,post:await s.create({title:e,description:t,post_text:r,author:o,email_author:i,images:c})}}async searchPost(e){const t=await s.findById(e);if(!t)throw n.BadRequest(`Пост ${e} удален или еще не был создан`);return t}async getPosts(){return await s.find().populate("author",["email","family_name","first_name"])}}},594:(e,t,r)=>{const s=r(344),a=r(878);e.exports=new class{generateTokens(e){return{accessToken:s.sign(e,process.env.JWT_ACCESS_SECRET,{expiresIn:"30s"}),refreshToken:s.sign(e,process.env.JWT_REFRESH_SECRET,{expiresIn:"30d"})}}validateAccessToken(e){try{return s.verify(e,process.env.JWT_ACCESS_SECRET)}catch(e){return null}}validateRefreshToken(e){try{return s.verify(e,process.env.JWT_REFRESH_SECRET)}catch(e){return null}}async saveToken(e,t){const r=await a.findOne({user:e});if(r)return r.refreshToken=t,r.save();await a.create({user:e,refreshToken:t})}async removeToken(e){return await a.deleteOne({refreshToken:e})}async findToken(e){return await a.findOne({refreshToken:e})}}},966:(e,t,r)=>{const s=r(645),a=r(96),n=r(828),o=r(611),i=r(594),c=r(125),u=r(52),d=r(645);e.exports=new class{async registration(e,t){if(await s.findOne({email:e}))throw u.BadRequest(`Пользователь с почтовым адресом ${e} уже существует`);const r=await a.hash(t,3),d=n.v4(),p=await s.create({email:e,password:r,activation_link:d});await o.sendActivationMail(e,`${process.env.API_URL}/api/activate/${d}`);const l=new c(p),h=i.generateTokens({...l});return await i.saveToken(l.id,h.refreshToken),{...h,user:l}}async activate(e){const t=await s.findOne({activation_link:e});if(!t)throw u.BadRequest("Неккоректная ссылка активации");t.is_activated=!0,await t.save()}async login(e,t){const r=await s.findOne({email:e});if(!r)throw u.BadRequest("Пользователь с таким email небыл найден");if(!await a.compare(t,r.password))throw u.BadRequest("Неверный пароль");const n=new c(r),o=i.generateTokens({...n});return await i.saveToken(n.id,o.refreshToken),{...o,user:n}}async logout(e){return await i.removeToken(e)}async refresh(e){if(!e)throw u.UnauthorizedError();const t=i.validateRefreshToken(e),r=await i.findToken(e);if(!t||!r)throw u.UnauthorizedError();const a=await s.findById(t.id),n=new c(a),o=i.generateTokens({...n});return await i.saveToken(n.id,o.refreshToken),{...o,user:n}}async getAllUsers(){return await s.find()}async getUser(e){if(!e)throw u.BadRequest("Укажите id пользователя");return await d.findById(e)}async updateUserProfile(e,t,r,a){if(!a)throw u.BadRequest("");return console.log(s.findById({_id:a})),await s.findByIdAndUpdate(a,{$set:{first_name:e,family_name:t,age:r,update:(new Date).toLocaleString("de-RU")}},{new:!0,useFindAndModify:!1})}}},96:e=>{"use strict";e.exports=require("bcrypt")},455:e=>{"use strict";e.exports=require("compression")},710:e=>{"use strict";e.exports=require("cookie-parser")},582:e=>{"use strict";e.exports=require("cors")},142:e=>{"use strict";e.exports=require("dotenv")},860:e=>{"use strict";e.exports=require("express")},553:e=>{"use strict";e.exports=require("express-validator")},806:e=>{"use strict";e.exports=require("helmet")},344:e=>{"use strict";e.exports=require("jsonwebtoken")},185:e=>{"use strict";e.exports=require("mongoose")},184:e=>{"use strict";e.exports=require("nodemailer")},828:e=>{"use strict";e.exports=require("uuid")}},t={};function r(s){var a=t[s];if(void 0!==a)return a.exports;var n=t[s]={exports:{}};return e[s](n,n.exports,r),n.exports}(()=>{r(142).config();const e=r(860),t=r(582),s=r(710),a=r(185),n=r(413),o=r(223),i=r(455),c=r(806),u=process.env.PORT||5e3,d=e();d.use(i()),d.use(c()),d.use(e.json()),d.use(s()),d.use(t({credentials:!0,origin:process.env.CLIENT_URL})),d.use("/api",n),d.use(o),(async()=>{try{await a.connect(process.env.DB_URL,{useUnifiedTopology:!0,useNewUrlParser:!0,useCreateIndex:!0}),d.listen(u,(()=>console.log(`Server started \nport: ${u}`)))}catch(e){console.error(e)}})()})()})();