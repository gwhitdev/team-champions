const ApiProxy = {
  baseUrl: "champions-proxy-api-f96177dcdfbf.herokuapp.com",
  options: {
    method: "GET"
  },
  result: {},
  loading: {state: false},
  getQuestionsAndAnswers: function(subject, numOfQuestions) {
    fetch(`https://${this.baseUrl}/proxy?subject=${subject}&numofquestions=${numOfQuestions}`,this.options)
      .then(response => response.json())
      .then(data => {
        this.result.questions = data.quiz.listOfQuestions.questions;
        this.result.answers = data.quiz.listOfAnswers.answers;
      })
      .then(() => console.info('Questions received...'))
      .catch(error => {
        this.result.error = error;
        this.loading.state = false;
      })
  }
}

export default ApiProxy;


