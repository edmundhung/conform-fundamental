import { useState, useRef, useSyncExternalStore, useCallback } from "react";

export function useForm(validateFn) {
	const [error, setError] = useState(() => validateFn({}));
    const [touched, setTouched] = useState([]);

	return {
		error,
		touched,
		props: {
			onChange(event) {
				const formData = new FormData(event.target.form);
				const value = Object.fromEntries(formData);
				const error = validateFn(value);

				setError(currentError => {
					if (JSON.stringify(currentError) === JSON.stringify(error)) {
						return currentError;
					}

					return error;
				});
			},
			onBlur(event) {
                const name = event.target.name;
				if (name) {
					setTouched(fields => {
						if (fields.includes(name)) {
							return fields;
						}
	
						return fields.concat(name);
					})
				}
			},
			onSubmit(event) {
                const formData = new FormData(event.currentTarget);

				if (Object.keys(error).length > 0) {
					event.preventDefault();

					setTouched(Array.from(formData.keys()));
				}
			},
		},
	};
}

export function useFormData(formId, selector) {
	const snapshotRef = useRef(null);
    const selectorRef = useRef(selector);

	return useSyncExternalStore(
        useCallback(subscribe => {
            const updateSnapshot = (formElement) => {
                snapshotRef.current = selectorRef.current(formElement ? new FormData(formElement) : null);
                subscribe();
            };

            const handleInput = event => {
                if (event.target.form === document.forms.namedItem(formId)) {
                    updateSnapshot(event.target.form);
                }
            }

            document.addEventListener("input", handleInput, true);
            
            const observer = new MutationObserver((mutations) => {
                const formElement = document.forms.namedItem(formId);

                for (const mutation of mutations) {
                    switch (mutation.type) {
                        case 'childList':
                            for (const node of [...mutation.addedNodes, ...mutation.removedNodes]) {
                                for (const input of getInputs(node)) {
                                    if (input.form === formElement) {
                                        updateSnapshot(formElement);
                                        return;
                                    }
                                }
                            }
                            break;
                        case 'attributes':
                            if (isInput(mutation.target) && mutation.target.form === formElement) {
                                updateSnapshot(formElement);
                                return;
                            }
                            break;
                    }
                }
            });

            observer.observe(document.body, { subtree: true, childList: true, attributeFilter: ["form", "name"] });

            updateSnapshot(document.forms.namedItem(formId));

            return () => {
                document.removeEventListener("input", handleInput, true);
                observer.disconnect();
            };
        }, [formId]),
        () => snapshotRef.current,
        () => snapshotRef.current,
    );
}

const getInputs = (node) => {
    if (node instanceof HTMLInputElement | node instanceof HTMLSelectElement | node instanceof HTMLTextAreaElement) {
        return [node];
    }

    if (node instanceof Element) {
        return Array.from(
            node.querySelectorAll<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
            >('input,select,textarea'),
        );
    }

    return [];
};