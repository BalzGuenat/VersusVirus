var app = new Vue({ 
    el: '#app',
    data: {
        message: 'Hello Vue!',
        loc: 'bar',
        loc_data: null
    },
    methods: {
      fetchData: function() {
        console.log(this.loc);
        axios
          .get('http://localhost:2020/api/cached/AnRYn1F8NfSGLexf7')
          .then(rsp => (this.loc_data = rsp))
      }
    }
});
