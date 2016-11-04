a = new Vue({
    el: '#app',
    data: {
        produtos: [],
        produtosOrder: 'asc',
        search: '',
        url: ''
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
            self.$http.post('http://127.0.0.1:5014/api/produtos/novo', { url: self.url }).then(function(r, e) {
                if (r) {
                    document.getElementById('openModalNovaUrlOK').click();
                    self.url = '';
                }
            });
        }
    },

    computed: {
        filtroSearch: function() {
            var self = this;
            return self.produtos.filter(function(p) {
                return p.nome.toLowerCase().indexOf(self.search.toLowerCase()) !== -1
            });
        }
    },

    mounted: function() {
        var self = this;
        self.$http.get('http://127.0.0.1:5014/api/produtos').then(function(r, e) {
            if (r) {
                self.produtos = r.body;
            }
        });
    }
});