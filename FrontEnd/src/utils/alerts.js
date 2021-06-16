import Swal from "sweetalert2";

export const showSuccessAlert = (title = "Success", text = "The action was performed successfully!") => {
	Swal.fire({
		title: title,
		text: text,
		icon: "success",
	});
};

export const showErrorAlert = (title = "Oops...", text = "Something went wrong!") => {
	Swal.fire({
		icon: "error",
		title: title,
		text: text,
	});
};

export const showConfirmAlert = (
	confirmFunction,
	title = "Are you sure?",
	text = "You won't be able to revert this!",
	confirmText = "Yes!"
) => {
	Swal.fire({
		title: title,
		text: text,
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: confirmText,
	}).then((result) => {
		if (result.isConfirmed) {
			confirmFunction();
		}
	});
};
