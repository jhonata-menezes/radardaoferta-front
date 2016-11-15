<template>
  <div>
  <div class="large-12 columns">
        <h2>Produtos</h2>
  </div>
  <hr>
  <form>
    <div class="">
      <div class="medium-4 columns">
        <input type="text" v-model="search" placeholder="Pesquisa">
      </div>
      <div class="medium-1 columns">
        <input type="number" v-model="qtdItensPorPaginaComputed" placeholder="Itens por Pagina">
      </div>
      <div class="medium-4 columns">
        <input type="text" v-model="url" v-on:keyup.enter="novaUrl" placeholder="URL do novo produto">
      </div>
    </div>
  </form>

  <div class="reveal" id="modalNovaUrlOK" data-reveal>
    <p>Muito obrigado por compartilhar o produto</p>
    <button class="close-button" data-close aria-label="Close modal" type="button">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>

  <hr>
  <div class="row small-up-2 large-up-4">
    <div class="column" v-for="p in filtroSearch">
      <img v-bind:title="p.nome" class="thumbnail" v-bind:src="p.imagens[0]">
      <h5>{{ p.nome.substring(0,46) }}</h5>
      <p>{{ "R$ " + p.valor.toFixed(2) }}</p>
      <a v-bind:href="p.link" class="button expanded" target="_blank"><b>{{ p.loja.charAt(0).toUpperCase() + p.loja.slice(1) }}<b></a>
    </div>
    <div>
      <ul class="pagination text-center" role="navigation" aria-label="Pagination">
        <li class="pagination-previous" v-bind:class="{'disabled': paginator.paginaAtual == 1}" v-on:click="anterior($event)">Anterior</li>
        <li v-for="itemPage in qtdPaginasClicaveis" v-bind:class="{'current': paginator.paginaAtual == itemPage}" v-on:click="paginacao($event, itemPage)"><a href="#">{{ itemPage }}</a></li>
        <li class="pagination-next"><a href="#" aria-label="Next page" v-bind:class="{'disabled': paginator.paginaAtual == 1}" v-on:click="proximo($event)">Proximo</a></li>
      </ul>
    </div>
  </div>
  <hr>
  <a id="openModalNovaUrlOK" data-open="modalNovaUrlOK"></a>
  </div>
</template>



<script>
    module.exports = {
        data: function() {
            return {
                produtos: [],
                produtosCompleto: [],
                produtosOrder: 'asc',
                search: '',
                url: '',
                paginator: {
                    paginaAtual: 1,
                    qtdItensPorPagina: 50,
                    qtdIndicesPagina: 4
                }
            }
        },
        methods: {
            orderByColumn: function(event, col) {
                event.preventDefault();
                if (this.produtosOrder == 'asc') {
                    this.produtosOrder = 'desc';
                } else {
                    this.produtosOrder = 'asc';
                }
                this.produtos = _.orderBy(this.produtos, col, this.produtosOrder);
            },
            novaUrl: function(event) {
                event.preventDefault();
                var self = this;
                self.$http.post('http://192.168.56.111:5014/api/produtos/novo', {
                    url: self.url
                }).then(function(r, e) {
                    if (r) {
                        document.getElementById('openModalNovaUrlOK').click();
                        self.url = '';
                    }
                });
            },
            paginacao: function(e, p) {
                e.preventDefault();
                this.paginator.paginaAtual = p;
            },
            anterior: function(e) {
                e.preventDefault();
                this.paginator.paginaAtual--;

            },
            proximo: function(e) {
                e.preventDefault();
                this.paginator.paginaAtual++;
            },
            qtdTotalItens: function() {
                return this.produtosCompleto.length;
            },
            atualizaQuantidadeLista: function(e) {
                var inicio = (this.qtdTotalItens() * (this.paginator.paginaAtual - 1));
                this.produtos = this.produtosCompleto.slice(inicio, this.paginator.qtdItensPorPagina);
            }
        },

        computed: {
            filtroSearch: function() {
                var self = this;
                return self.produtos.filter(function(p) {
                    return p.nome.toLowerCase().indexOf(self.search.toLowerCase()) !== -1
                });
            },
            qtdItensPorPaginaComputed: {
                get: function() {
                    return this.paginator.qtdItensPorPagina;
                },
                set: function(v) {
                    this.paginator.qtdItensPorPagina = v;
                    this.atualizaQuantidadeLista();
                }
            },

            qtdPaginasClicaveis: function() {
                return [1, 2, 3];
            }
        },

        mounted: function() {
            var self = this;
            this.$http.get('http://192.168.56.111:5014/api/produtos').then(function(r, e) {
                if (r) {
                    self.produtosCompleto = r.body;
                    self.produtos = self.produtosCompleto.slice(0, self.paginator.qtdItensPorPagina);
                }
            });
        }

    }
</script>