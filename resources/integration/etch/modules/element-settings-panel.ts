/**
 * Element Settings Panel Module
 * 
 * This module adds an icon picker button to the 'name' field in the Element Settings panel
 * when editing an omni-icon element, similar to how WindPress adds a sort button to the class field.
 */

// Helper function to get the icon picker API
const getIconPickerAPI = () => {
	return (window as any).omniIconPicker;
};

/**
 * Register icon picker button for the name attribute
 */
async function registerIconPickerButton(containerEl: HTMLElement) {
	const nameInput = containerEl.querySelector('input[type="text"]') as HTMLInputElement | null;
	if (!nameInput) {
		return;
	}

	// Create the icon picker button
	const iconPickerButton = document.createRange().createContextualFragment(/*html*/`
		<button id="omni-icon-picker-action" title="[Omni Icon] Pick Icon" type="button" class="etch-builder-button etch-builder-button--icon-placement-before etch-builder-button--variant-icon" style="--button-font-size: 13px; --e-icon-padding: 0; margin-left: auto;">
			<div class="icon-wrapper">
				<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="etch-icon iconify iconify--omni-icon" width="12px" height="12px" viewBox="0 0 400 400">
					<path fill="currentColor" fill-rule="evenodd" d="M 0 0 H 400 V 400 H 0 Z M 195 61 L 158 99 L 400 333 L 400 259 Z M 0 75 L 0 149 L 195 339 L 232 301 Z" />
				</svg>
			</div>
		</button>
	`).querySelector('#omni-icon-picker-action');

	const labelEl = containerEl.querySelector(':scope > span');
	if (labelEl instanceof HTMLElement && iconPickerButton) {
		labelEl.style.display = 'flex';
		labelEl.appendChild(iconPickerButton);

		// Add click event listener to the button
		iconPickerButton.querySelector('div.icon-wrapper')?.addEventListener('click', () => {
			const iconPicker = getIconPickerAPI();
			if (!iconPicker) {
				console.error('[Omni Icon] Icon picker API not available');
				return;
			}

			// Open the icon picker with the current value
			iconPicker.open(nameInput.value || '', (iconName: string) => {
				if (iconName) {
					// Update the input value with the selected icon name
					nameInput.value = iconName;

					// Trigger input event to notify Etch about the change
					nameInput.dispatchEvent(new Event('input', { bubbles: true }));
				}
			});
		});
	}

	containerEl.dataset.omniIconInjected = 'true';
}

/**
 * MutationObserver to watch for omni-icon element settings panel
 */
const observer = new MutationObserver(() => {
	// Look for the name field in the Element Settings panel for omni-icon elements
	// XPath: Find label with text 'name' inside an element settings wrapper for omni-icon
	const target: HTMLElement | null | undefined = document.evaluate(
		"//div[contains(@class, 'etch-html-block-properties-wrapper')]//label[contains(@class, 'etch-label')]/span[text()='name']",
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null
	).singleNodeValue?.parentElement;

	if (target && !target.dataset.omniIconInjected) {
		// Check if this is for an omni-icon element
		// Look for all Element Settings titles and find the one that contains "omni-icon"
		const elementTitles = Array.from(document.querySelectorAll('.etch-element__title'));
		const omniIconTitle = elementTitles.find(el => el.textContent?.toLowerCase().includes('omni-icon'));
		
		if (omniIconTitle) {
			setTimeout(() => {
				if (target.dataset.omniIconInjected) {
					return; // Already injected
				}

				console.log('[Omni Icon] Injecting icon picker button for name field');
				registerIconPickerButton(target);
			}, 100); // Delay to ensure the element is ready
		}
	}
});

observer.observe(document, {
	subtree: true,
	childList: true,
});

console.log('[Omni Icon] Element settings panel module loaded');
