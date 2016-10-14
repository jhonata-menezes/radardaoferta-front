a = new Vue({
    el: '#app',
    data: {
        produtos: [],
        produtosOrder: 'asc',
        search: ''
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
        self.$http.get('/produtos.json').then(function(r, e) {
            if (r) {
                self.produtos = r.body;
            }
        });
    }
});