import { Form } from "@remix-run/react";
import { useState } from "react";
import { useRenderCount } from "../util"

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
	const count = useRenderCount();
	const [error, setError] = useState(() => validate({}));
	const [touched, setTouched] = useState([]);
	
	return (
		<Form
			className="space-y-4"
			onChange={event => {
				const formData = new FormData(event.target.form);
				const value = Object.fromEntries(formData);
				const error = validate(value);

				setError(currentError => {
					if (JSON.stringify(currentError) === JSON.stringify(error)) {
						return currentError;
					}

					return error;
				});
			}}
			onBlur={(event) => {
				const name = event.target.name;
				if (name) {
					setTouched(fields => {
						if (fields.includes(name)) {
							return fields;
						}
	
						return fields.concat(name);
					})
				}
			}}
			onSubmit={event => {
				const formData = new FormData(event.currentTarget);
				if (Object.keys(error).length > 0) {
					event.preventDefault();

					setTouched(Array.from(formData.keys()));
				}
			}}
		>
			<div>Render: {count}</div>
			<label className="block" htmlFor="title">
				Title
			</label>
			<div>
				<input
					id="title"
					name="title"
					type="text"
				/>
				{touched.includes("title") ? (
					<div className="text-red-500">{error.title}</div>
				) : null}
			</div>
			<label className="block" htmlFor="message">
				Message
			</label>
			<div>
				<textarea
					id="message"
					name="message"
				/>
				{touched.includes("message") ? (
					<div className="text-red-500">{error.message}</div>
				) : null}
			</div>
			<button className="border p-2">Submit</button>
		</Form>
	);
}
