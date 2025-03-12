import { Form } from "@remix-run/react";
import { useForm, useFormData } from "../form";

function validate(value) {
	const error = {};

	if (!value.title) {
		error.title = "Title is required";
	}

	if (!value.message) {
		error.message = "Message is required";
	}

	return error;
}

export default function Example() {
	const { error, touched, props } = useForm(validate);

	return (
		<Form id="bonus" className="space-y-4" {...props}>
			<label className="block" htmlFor="title">
				Title
			</label>
			<div>
				<input id="title" name="title" type="text" />
				{touched.includes("title") ? (
					<div className="text-red-500">{error.title}</div>
				) : null}
			</div>
			<label className="block" htmlFor="message">
				Message
			</label>
			<div>
				<textarea id="message" name="message" />
				{touched.includes("message") ? (
					<div className="text-red-500">{error.message}</div>
				) : null}
			</div>
		</Form>
	);
}

