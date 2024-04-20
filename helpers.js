// Houses validation and helper functions
function validate(params) {

    //Iterate over each parameter.
    params.forEach(({ value, type, name, range, arrayType }) => {

     //Validate the type for input parameters that are expected to be boolean.
    if (type === 'boolean') {
        if (typeof value !== 'boolean') {
            throw new Error(`Error: ${name} must be a boolean`);
        }
    }
    
    //If the value is falsy, throw an error. Empty strings and 0 for numbers are allowed here for
    //future reusability of this code. Since these values are not valid for this lab they are restricted
    //in the if statements that follow.
    if (type !== 'boolean' && !value && ((type !== 'string' && value !== '') || (type !== 'number' && value !== 0))) {
        throw new Error(`Error: ${name} cannot be falsy.`);
    }

    if (type === 'string') {
        //Validate the type for input parameters that are expected to be numbers.
        if (typeof value !== 'string') {
            throw new Error(`Error: ${name} must be a string.`)
        }
        //Check if the string is empty or made up of just spaces.
        if (value.trim().length === 0) {
            throw new Error(`Error: ${name} cannot be an empty string or just spaces.`)
        }
    }
    //Validate the type for input parameters that are expected to be numbers.
    else if (type === 'number') {
        if ( typeof value !== 'number' || isNaN(value)) {
            throw new Error(`Error: ${name} must be a number.`)
        }
        //Validate the range.
        if (range && (value < range.min || value > range.max)) {
            throw new Error(`Error: ${name} must be within the range ${range.min} to ${range.max}`);
        }
    }
   
    //Validate the type for input parameters that are expected to be an array.
    else if (type === 'array') {
        if (!Array.isArray(value)) {
            throw new Error(`Error: ${name} must be an array.`);
        }
        if (value.length === 0) {
            throw new Error(`Error: ${name} cannot be an empty array`);
        }
        if (!value.some(item => typeof item === 'string' && item.trim().length > 0)) {
            throw new Error(`Error: ${name} must contain atleast one element that is a string and this element cannot be empty or made up of just spaces.`);
        }
        if (arrayType) {
            value.forEach(item => {
                if (typeof item !== arrayType) {
                    throw new Error(`Error: Each element in ${name} cannot be a ${arrayType}`);
                }
            });
        }
    }
    //Validate the type for input parameters that are expected to be an object.
    else if (type === 'object') {
        if (typeof value !== 'object' || Array.isArray(value)) {
            throw new Error(`Error: ${name} must be an object.`);
        }
        if (Object.keys(value).length === 0) {
            throw new Error(`Error: ${name} cannot be an empty object.`);
        }
    }
    //Validate type for any other expected type.
    else {
        if (typeof value !== type) {
            throw new Error(`Error: ${name} must be a ${type}.`);
        }
    }
  });
}

function isValidDate(dateString) {
    //Regular expression to test that the date format is mm/dd/yyyy.
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    
    //If the dateString does not match this format, then it is not a valid date.
    if (!regex.test(dateString)) {
        return false;
    }

    //Split the dateString into an array and convert each part to numbers.
    const [month, day, year] = dateString.split('/').map(Number);

    //Create a date object, only the month must be adjusted for indexing starting at zero.
    const date = new Date(year, month - 1, day);

    //Check if the date is valid.
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
        return false;
    }
 
    return true;
}

//Function to calculate the new average rating after a review is added, deleted, or the rating is modified.
function calculateNewAverage(reviews, newRating) {

    //Sum the newRating and all the ratings in the review array.
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, newRating);

    //Find the average using the sum of these.
    return totalRating / (reviews.length + 1);
}

export {
    validate,
    isValidDate,
    calculateNewAverage,
}