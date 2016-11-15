<template>
  <div>  
      <router-link to="/">Bar</router-link>
  </div>
</template>


<script>
    import Vue from 'vue';
    module.exports = {
        mounted: function() {
            var self = this;
            self.$http.get('http://192.168.56.111:5014/api/produtos').then(function(r, e) {
                if (r) {
                    self.produtosCompleto = r.body;
                    self.produtos = self.produtosCompleto.slice(0, self.paginator.qtdItensPorPagina);
                }
            });
        }

    }
</script>