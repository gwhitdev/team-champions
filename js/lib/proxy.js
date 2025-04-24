const proxy = {
  baseUrl: "champions-proxy-api-f96177dcdfbf.herokuapp.com/",
  options: {
    method: "GET"
  },
  result: {},
  loading: {state: false},
  getQuestionsAndAnswers: function(subject) {
    fetch(`${this.baseUrl}/proxy?subject=${subject}`,this.options)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.result.raw = data.choices[0].message.content
      })
      .then(() => {
        this.result.split = this.result.raw.split("\n\n");
       // this.loading.state = false;
      })
      .then(() => console.info('Questions received...'))
      .then(() => console.log(this.result))
      .catch(error => {
        console.log(error)
        this.result.error = error;
        this.loading.state = false;
      })
  }
}

export default proxy;


