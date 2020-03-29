import axios from "axios"

export default axios.create({
    baseURL: 'https://react-quiz-68682.firebaseio.com/'
})