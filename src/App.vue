<template>
    <div class="">
        <div class="row large-12 columns">
            <h2 class="text-center">Radar da Oferta</h2>
            <h3 class="subheader text-center">Compartilhe ofertas da submarino, americanas, shoptime, soubarato, casabahia, ponto frio, extra, cdiscount, netshoes, magazine luiza e walmart </h3>
            <h4 class="subheader text-center">Envie promoções tambem pelo <a href="https://telegram.me/RadarDaOfertaBot" target="_blank">Telegram <img title="RadarDaOfertaBot" width="25" height="25" src="https://telegram.org/img/t_logo.png"></a></h4>
        </div>
        <hr>
        <form>
            <div class="row">
                <div class="medium-4 columns">
                    <input type="text" v-model="search" placeholder="Pesquisa">
                </div>
                <div class="medium-6 columns">
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

        <div class="row small-up-2 large-up-4">
            <div class="column" v-for="p in filtroSearch" >
                <div class="thumbnail">
                <div class="image-height">
                    <div class="top-bar">
                        <div class="top-bar-left">
                            Há {{ haQuantoTempoPublicado(p.created) }}
                        </div>
                    </div>
                    <img v-bind:title="p.nome"  v-bind:src="p.imagens[0]" style="width=100%">
                </div>
                <p><span class="warning badge" title="Cliques">{{ p.cliques }}</span></p>
                <h6 class="column">{{ p.nome.substring(0,46) }}</h6>
                <p class="lead text-center"><span>{{ "R$ " + p.valor.toFixed(2) }}</span></p>
                <a v-bind:href="'/produtos/redirecionar/' + p.id" class="button expanded" target="_blank" aria-hidden="true"><b>{{ p.loja.charAt(0).toUpperCase() + p.loja.slice(1) }} <i class="fa fa-external-link"> </i><b></a>
            </div>
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
    var axiosRadarOferta = axios.create({
        baseURL: 'http://api.radardaoferta.com.br/',
        timeout: 9000,
        headers: {
            //
        }
    });
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
                axiosRadarOferta.post('/produtos/novo', {
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
            },

            diferencaTempoVisual: function(d) {
                var now = new Date();
                var diferenca = Math.abs(now - d);
                var minutos = Math.trunc(diferenca / 1000 / 60);
                if (minutos < 60) {
                    if (minutos < 10) {
                        return "00:0" + minutos
                    }
                    return "00:" + minutos
                }
                var horas = Math.trunc(diferenca / 1000 / 60 / 60);
                var minutosDeHoras = Math.trunc(minutos - (horas * 60));
                if (minutos < 1440) {
                    if (minutosDeHoras < 10) {
                        return horas + ":0" + minutosDeHoras
                    }
                    return horas + ":" + minutosDeHoras
                }
                var dias = Math.trunc(horas / 24);
                return dias + this.palavrasPlural(dias, " Dia ", " Dias ");
            },
            haQuantoTempoPublicado: function(data) {
                var date = new Date(data);
                return this.diferencaTempoVisual(date);
            },
            palavrasPlural: function(i, s, p) {
                if (i == 1) {
                    return s;
                }
                return p;
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
            axiosRadarOferta.get('/produtos').then((r) => {
                if (r) {
                    this.produtosCompleto = r.data;
                    this.produtos = this.produtosCompleto.slice(0, this.paginator.qtdItensPorPagina);
                }
            });
        }

    }
</script>

<style>
    .image-height {
        height: 200px;
    }
</style>