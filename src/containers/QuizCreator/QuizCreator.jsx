import React, {Component} from 'react';
import classes from './QuizCreator.css'
import Button from "../../components/UI/Button/Button";
import Select from "../../components/UI/Select/Select";
import {createControl, validate, validateForm} from '../../form/formFramework'
import Input from "../../components/UI/Input/Input";
import Auxiliary from '../../hoc/Auxiliary/Auxiliary'
import axios from'../../axios/axios-quiz'
import {connect} from "react-redux";
import {createQuizQuestion, finishCreateQuiz} from "../../store/actions/created";

function createOptionControl(questionNumber) {
    return createControl({
        label:`${questionNumber} answer`,
        errorMessage: 'Value cannot be empty',
        id: questionNumber
    },{required:true})
}
function createFormControls(){
    return {
        question: createControl({
            label: 'Enter a question',
            errorMessage: 'The question cannot be empty.'
        }, {required: true}),
        optionFirst: createOptionControl(1),
        optionSecond: createOptionControl(2),
        optionThird: createOptionControl(3),
        optionFourth: createOptionControl(4),
    }
}

class QuizCreator extends Component {
    state ={
        isFormValid: false,
        rightAnswerId: 1,
        formControls: createFormControls()
    };

    submitHandler = event => {
        event.preventDefault()
    };
    addQuestionHandler = event => {
        event.preventDefault();
        const {question, optionFirst, optionSecond, optionThird, optionFourth} = this.state.formControls;
        const questionItem = {
            question: question.value,
            id: this.props.quiz.length + 1,
            rightAnswerId: this.state.rightAnswerId,
            answers: [
                {text: optionFirst.value, id:optionFirst.id},
                {text: optionSecond.value, id:optionSecond.id},
                {text: optionThird.value, id:optionThird.id},
                {text: optionFourth.value, id:optionFourth.id}
            ]
        };

        this.props.createQuizQuestion(questionItem);
        this.setState({
            isFormValid: false,
            rightAnswerId: 1,
            formControls: createFormControls()
        })
    };
        createQuizHandler = event => {
        event.preventDefault();

            axios.post(
                '/quizes.json',
                this.state.quiz);

            this.setState({
                isFormValid: false,
                rightAnswerId: 1,
                formControls: createFormControls()
            });

            this.props.finishCreateQuiz()
    };
    changeHandler = (value, controlName) => {
        const formControls = {...this.state.formControls};
        const control = {...formControls[controlName]};

        control.touched = true;
        control.value = value;
        control.valid = validate(control.value, control.validation);

        formControls[controlName] = control;

        this.setState({
            formControls,
            isFormValid: validateForm(formControls)
        })
    };
    selectChangeHandler = event => {
        this.setState({
            rightAnswerId: +event.target.value
        })
    };
    renderControls(){
        return Object.keys(this.state.formControls).map((controlName,index)=>{
            const control = this.state.formControls[controlName];

            return(
                <Auxiliary key={controlName + index}>
                    <Input
                        label={control.label}
                        value={control.value}
                        valid={control.valid}
                        shouldValidate={!!control.validation}
                        touched={control.touched}
                        errorMessage={control.errorMessage}
                        onChange={event => this.changeHandler(event.target.value, controlName)}
                    />
                    {index === 0 ? <hr /> : null}
                </Auxiliary>
            )
        })
    }

    render() {
        const select = <Select
            label='Choose the correct answer'
            value={this.state.rightAnswerId}
            onChange={this.selectChangeHandler}
            options={[
                {text: 1, value: 1},
                {text: 2, value: 2},
                {text: 3, value: 3},
                {text: 4, value: 4}
            ]}
        />;

        return (
            <div className={classes.QuizCreator}>
                <div>
                    <h1>Quiz Create</h1>
                    <form onSubmit={this.submitHandler}>
                        { this.renderControls() }

                        {select}
                        <Button
                            type='primary'
                            onClick={this.addQuestionHandler}
                            disabled={!this.state.isFormValid}
                        >
                            Add a question
                        </Button>
                        <Button
                            type='success'
                            onClick={this.createQuizHandler}
                            disabled={this.props.quiz.length === 0}
                        >
                            Create Quiz
                        </Button>
                    </form>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        quiz: state.create.quiz
    }
}
function mapDispatchToProps(dispatch){
    return{
        createQuizQuestion: item => dispatch(createQuizQuestion(item)),
        finishCreateQuiz: () => dispatch(finishCreateQuiz())
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (QuizCreator);