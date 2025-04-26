const Proxy = {
  baseUrl: "champions-proxy-api-f96177dcdfbf.herokuapp.com",
  options: {
    method: "GET"
  },
  result: {},
  loading: {state: false},
  getQuestionsAndAnswers: function(subject) {
    fetch(`https://${this.baseUrl}/proxy?subject=${subject}`,this.options)
      .then(response => response.json())
      .then(data => {
        this.result.questions = data.quiz.listOfQuestions.questions;
        this.result.answers = data.quiz.listOfAnswers.answers;
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

export default Proxy;


