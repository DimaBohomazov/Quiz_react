import React, {Component} from "react";
import classes from "./Quiz.css"
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz";
import FinishedQuiz from "../../components/FinishedQuiz/FinishedQuiz";
import axios from "../../axios/axios-quiz"
import Loader from "../../components/UI/Loader/Loader";

class Quiz extends Component{
    state = {
        results: {},
        isFinished: false,
        activeQuestion: 0,
        answerState: null,
        quiz: [
            /*{
                question: 'What color is the sky?',
                rightAnswerId: 2,
                answers: [
                    { text:'Black', id:1 },
                    { text:'Blue', id:2 },
                    { text:'Red', id:3 },
                    { text:'Green', id:4 }
                ],
                id: 1
            },
            {
                question: 'In what year was Kharkiv founded?',
                rightAnswerId: 3,
                answers: [
                    { text:'1488', id:1 },
                    { text:'1715', id:2 },
                    { text:'1654', id:3 },
                    { text:'1945', id:4 }
                ],
                id: 2
            }*/
        ],
        loading: true
    };



    onAnswerClickHandler = answerId => {
        if(this.state.answerState){
            const key = Object.keys(this.state.answerState)[0];
            console.log('key', key);
            if(this.state.answerState[key] === 'success'){
                return
            }
        }

        const question = this.state.quiz[this.state.activeQuestion];
        const results = this.state.results;

        if (question.rightAnswerId === answerId) {
            if(!results[question.id]) {
                results[question.id] = 'success'
            }
            this.setState({
                answerState: {[answerId]: 'success'},
                results
            });
            const timeout =window.setTimeout(() => {
                if(this.isQuizFinished()){
                    this.setState({
                        isFinished: true
                    })
                } else {
                    this.setState({
                        activeQuestion: this.state.activeQuestion + 1,
                        answerState: null
                    })
                }
                window.clearTimeout(timeout)
            }, 1000)
        } else {
            results[question.id] = 'error';
            this.setState({
                answerState: {[answerId]: 'error'},
                results   // results: results
            })
        }
    };

    isQuizFinished () {
        return this.state.activeQuestion + 1 === this.state.quiz.length
    }
    retryHandler = () => {
        this.setState({
            activeQuestion: 0,
            answerState: null,
            isFinished: false,
            results: {}
        })
    };

    async componentDidMount() {
        try {
            const response = await axios.get(`/quizes/${this.props.match.params.id}.json`);
            const quiz = response.data;

            this.setState({
                quiz,
                loading: false
            })

        } catch (e) {
            console.log(e)
        }
        console.log('quizID=', this.props.match.params.id)
    }


    render() {
        return(
            <div className={classes.Quiz}>
                <div className={classes.QuizWrapper}>
                    <h1>Answer all questions</h1>
                    {
                     this.state.loading
                        ? <Loader />
                        : this.state.isFinished
                         ? <FinishedQuiz
                             results = { this.state.results }
                             quiz = { this.state.quiz }
                             onRetry = { this.retryHandler }
                         />
                         : <ActiveQuiz
                             answers = { this.state.quiz[this.state.activeQuestion].answers }
                             question = { this.state.quiz[this.state.activeQuestion].question }
                             onAnswerClick = { this.onAnswerClickHandler }
                             quizLength = { this.state.quiz.length }
                             answerNumber = { this.state.activeQuestion + 1 }
                             state = { this.state.answerState }
                         />
                    }
                </div>
            </div>

        )
    }
}

export default Quiz