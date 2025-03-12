import { Form } from "@remix-run/react";
import { useState } from "react";

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
	const [value, setValue] = useState({});
	const [touched, setTouched] = useState([]);
	const error = validate(value);

	return (
		<Form
			className="space-y-4"
			onSubmit={event => {
				if (Object.keys(error).length > 0) {
					event.preventDefault();

					setTouched(['title', 'message']);
				}
			}}
		>
			<label className="block" htmlFor="title">
				Title
			</label>
			<div>
				<input
					id="title"
					name="title"
					type="text"
					value={value.title}
					onChange={(event) => setValue({ ...value, title: event.target.value })}
					onBlur={() => setTouched(fields => fields.concat('title'))}
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
					value={value.message}
					onChange={(event) => setValue({ ...value, message: event.target.value })}
					onBlur={() => setTouched(fields => fields.concat('message'))}
				/>
				{touched.includes("message") ? (
					<div className="text-red-500">{error.message}</div>
				) : null}
			</div>
			<button className="border p-2">Submit</button>
		</Form>
	);
}
