// this depends on whether the function does need to be shared (means it can be called from different files)
// currently this is only used by routes.js
// but the idea is that if the app gets more complex and the validation is required somewhere else
// then this is going to make more sense.

function validPuppy(puppy) {
	return typeof puppy.name == 'string' &&
		puppy.name.trim() != ''
		// + add something for other fields
};

/*
function otherValidation(something_else) {

}
*/

module.exports = {
	validPuppy
	//, otherValidation
}

//see routes.js how just the validPuppy is then brought in.