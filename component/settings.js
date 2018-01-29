const storage=require("../js/storage")
const monappyApi=require("../js/monappyApi")
const currencyList = require("../js/currencyList")
module.exports=require("./settings.html")({
  data(){
    return {
      resetDialog:false,
      resetDialogConfirm:false,
      isWebView:false,
      monappyNotExist:false,
      d:{
        includeUnconfirmedFunds:false,
        zaifPay:{
          enabled:null,
          apiKey:"",
          secret:""
        },
        useEasyUnit:false,
        absoluteTime:false,
        fiat:"jpy",
        paySound:false,
        monappy:{
          enabled:false,
          myUserId:""
        },
        monaparty:{
          enabled:true,
          bgClass:"sand"
        }
      },
      monapartyTitleList:currencyList.monapartyTitle
    }
  },
  methods:{
    goToShowPassphrase(){
      this.$emit("push",require("./showPassphrase.js"))
    },
    goToSweep(){
      this.$emit("push",require("./sweep.js"))
    },
    goToEditOrder(){
      this.$emit("push",require("./editOrder.js"))
    },
    goToSign(){
      this.$emit("push",require("./sign.js"))
    },
    goToSetPassword(){
      this.$emit("push",require("./setPassword.js"))
    },
    goToManageCoin(){
      this.$emit("push",require("./manageCoin.js"))
    },
    save(){
      this.$nextTick(()=>{
        storage.set("settings",this.d)
        this.$store.commit("setSettings",this.d)
      })
    },
    changeMonappy(){
      this.save()
      if (this.d.monappy.myUserId) {
        monappyApi.getAddress(this.d.monappy.myUserId).then(r=>{
          this.monappyNotExist=!r
        }).catch(r=>{
          this.monappyNotExist=true
        })
      }else{
        this.monappyNotExist=false
      }
    },
    reset(){
      Promise.all(["keyPairs","labels","txLabels","settings","customCoins","addresses","zaifPayInvoice"].map(v=>storage.set(v,null))).then(()=>{
        this.$store.commit("deleteEntropy")
        this.$store.commit("setFinishNextPage",{page:require("./first.js"),infoId:"reset"})
        this.$emit("replace",require("./finished.js"))
      })
    }
  },
  mounted(){
    this.isWebView=this.$ons.isWebView()
    storage.get("settings").then(d=>{
      Object.assign(this.d,d)
    })
  }
})
