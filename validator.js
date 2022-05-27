const {body,validationResult} = require('express-validator');

validationBodyRules=[
    body('ranking','Ranking must be between 1 and 100').notEmpty().isInt({min:1,max:100}),
    body('name','Name must not be empty').notEmpty()
]

checkRules=(request,response,next) => {
    const errors=validationResult(request)
    if(!errors.isEmpty()) {
        return response.status(400).send(errors.array().at(0).msg)
    }
    next();
}

module.exports = {
    validationBodyRules,
    checkRules,
}