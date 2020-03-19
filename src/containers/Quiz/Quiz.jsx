import React, {Component} from "react";
import classes from "./Quiz.css"
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz";

class Quiz extends Component{
    state = {
        activeQuestion: 0,
        answerState: null,
        quiz: [
            {
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
            }
        ]
    };

    onAnswerClickHandler = answerId => {
        if(this.state.answerState){
            const key = Object.keys(this.state.answerState)[0]
            if(this.state.answerState[key] === 'success'){
                return
            }
        }

        const question = this.state.quiz[this.state.activeQuestion]

        if (question.rightAnswerId === answerId) {
            this.setState({
                answerState: {[answerId]: 'success'}
            });

            const timeout =window.setTimeout(() => {
                if(this.isQuizFinished()){
                    console.log('Finished')
                } else {
                    this.setState({
                        activeQuestion: this.state.activeQuestion + 1,
                        answerState: null
                    })
                }
                window.clearTimeout(timeout)
            }, 1000)
        } else {
            this.setState({
                answerState: {[answerId]: 'error'}
            })
        }

    };

    isQuizFinished () {
        return this.state.activeQuestion + 1 === this.state.quiz.length
    }

    render() {
        return(
            <div className={classes.Quiz}>
                <div className={classes.QuizWrapper}>
                    <h1>Answer all questions</h1>
                    <ActiveQuiz
                    answers = { this.state.quiz[this.state.activeQuestion].answers }
                    question = { this.state.quiz[this.state.activeQuestion].question }
                    onAnswerClick = { this.onAnswerClickHandler }
                    quizLength = { this.state.quiz.length }
                    answerNumber = { this.state.activeQuestion + 1 }
                    state = { this.state.answerState }
                    />
                </div>
            </div>

        )
    }
}

export default Quiz