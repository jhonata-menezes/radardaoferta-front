a = new Vue({
    el: '#app',
    data: {
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
            self.$http.post('http://192.168.56.111:5014/api/produtos/novo', { url: self.url }).then(function(r, e) {
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
        self.$http.get('http://192.168.56.111:5014/api/produtos').then(function(r, e) {
            if (r) {
                self.produtosCompleto = r.body;
                self.produtos = self.produtosCompleto.slice(0, self.paginator.qtdItensPorPagina);
            }
        });
    }
});