<template>
    <div class="row">
        <div class="large-12 columns">
            <h2>Radar da Oferta</h2>
            <p class="subheader">Monitore ofertas da submarino, americanas, shoptime, soubarato, casabahia, ponto frio, extra, cdiscount</p>
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

        <div class="reveal" id="modalNovaUrl" data-reveal>
            <p id="modalNovaUrlMensagem"></p>
            <button class="close-button" data-close aria-label="Close modal" type="button">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        
        <a id="openModalNovaUrl" data-open="modalNovaUrl"></a>

        <hr>
        <div class="row small-up-2 large-up-4">
            <div class="column" v-for="p in filtroSearch">
                <img v-bind:title="p.nome" class="thumbnail" v-bind:src="p.imagens[0]">
                <h5>{{ p.nome.substring(0,46) }}</h5>
                <p>{{ "R$ " + p.valor.toFixed(2) }}</p>
                <a v-bind:href="p.link" class="button expanded" target="_blank"><b>{{ p.loja.charAt(0).toUpperCase() + p.loja.slice(1) }}<b></a>
            </div>
        </div>
        <div>
            <footer class="footer">
                <ul class="pagination text-center" role="navigation" aria-label="Pagination">
                    <li class="pagination-previous" v-bind:class="{'disabled': paginator.paginaAtual == 1}" v-on:click="anterior($event)">
                        <span v-if="paginator.paginaAtual == 1" >Anterior<span class="show-for-sr"></span></span>
                        <a v-else href="#" aria-label="Next page">Anterior<span class="show-for-sr"></span></a>
                        
                    </li>
                    <li class="pagination-next" v-on:click="proximo($event)" v-bind:class="{'disabled': !proximaPaginaExiste()}">
                        <span v-if="!proximaPaginaExiste()" >Proxima<span class="show-for-sr"></span></span>
                        <a v-else href="#" aria-label="Next page">Proximo<span class="show-for-sr"></span></a>
                    </li>
                </ul>
            </footer>
        </div>
        <hr>
    </div>
</template>



<script>
    var axios = require('axios')
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
                axios.post('http://127.0.0.1:5014/api/produtos/novo', {
                    url: this.url
                }).then((r, e) => {
                    if (r.data.status == "ok") {
                        document.getElementById('modalNovaUrlMensagem').innerHTML = "Muito obrigado por compartilhar o produto";
                    } else if (r.data.status == "error") {
                        document.getElementById('modalNovaUrlMensagem').innerHTML = r.data.msg;
                    } else {
                        document.getElementById('modalNovaUrlMensagem').innerHTML = "Algo esta acontecendo, tente novamente em alguns segundos";
                    }
                    document.getElementById('openModalNovaUrl').click();
                    this.url = '';
                });
            },
            paginacao: function(e, p) {
                e.preventDefault();
                this.paginator.paginaAtual = p;
                this.atualizaQuantidadeLista();
            },
            anterior: function(e) {
                e.preventDefault();
                if (this.paginator.paginaAtual == 1) {
                    return;
                }
                this.paginator.paginaAtual--;
                this.atualizaQuantidadeLista();

            },
            proximo: function(e) {
                e.preventDefault();
                var qtdItensPassado = this.paginator.paginaAtual * this.paginator.qtdItensPorPagina;
                if ((qtdItensPassado < this.qtdTotalItens())) {
                    this.paginator.paginaAtual++;
                    this.atualizaQuantidadeLista();
                }

            },
            qtdTotalItens: function() {
                return this.produtosCompleto.length;
            },
            atualizaQuantidadeLista: function(e) {
                var inicio = ((this.paginator.paginaAtual - 1) * this.paginator.qtdItensPorPagina);
                this.produtos = this.produtosCompleto.slice(inicio, inicio + this.paginator.qtdItensPorPagina);
            },
            proximaPaginaExiste: function() {
                return (this.paginator.paginaAtual * this.paginator.qtdItensPorPagina) < this.qtdTotalItens()
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
            }
        },

        mounted: function() {
            axios.get('http://127.0.0.1:5014/api/produtos').then((r) => {
                if (r) {
                    this.produtosCompleto = r.data;
                    this.produtos = this.produtosCompleto.slice(0, this.paginator.qtdItensPorPagina);
                }
            });
        }

    }
</script>