a = new Vue({  
  el: '#app',
  data: {
     produtos:[],
     search:''
  },

  methods:{
  },
  computed:{
    filtroSearch:function(){
      var self=this;
      return self.produtos.filter(function (p) {
        return p.nome.toLowerCase().indexOf(self.search.toLowerCase()) !== -1
      });
    },
    orderByColumn: function(){
      return _.orderBy(this.produtos, 'valor');
    }
  },

  mounted:function(){
    var self=this;
    self.$http.get('/produtos.json').then(function(r, e){
      if(r){
        self.produtos = r.body;
      }
    });
  }
 });