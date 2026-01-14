/**
 * Omni Icon Picker Integration for Etch
 * 
 * Main entry point that waits for Etch to load and initializes the integration.
 */
import './editor.scss';

// Helper function to get the Etch iframe document
const getEtchIframeDocument = (): Document | null => {
	const iframe = document.getElementById('etch-iframe') as HTMLIFrameElement;
	return iframe?.contentDocument || iframe?.contentWindow?.document || null;
};

// Helper function to get the Etch iframe window
const getEtchIframeWindow = (): Window | null => {
	const iframe = document.getElementById('etch-iframe') as HTMLIFrameElement;
	return iframe?.contentWindow || null;
};

(async () => {
	// Wait for the Etch iframe to be ready
	while (!getEtchIframeDocument()?.querySelector('body')) {
		await new Promise(resolve => setTimeout(resolve, 100));
	}

	console.log('[Omni Icon] Etch editor detected, initializing...');

	// Dynamically import modules after iframe is ready
	// This ensures React and all dependencies are loaded before components
	const [
		{ openIconPicker, closeIconPicker, renderModal },
		webComponentInjector,
		elementMenuButton,
	] = await Promise.all([
		import('./editor-app'),
		import('./modules/webcomponent-injector'),
		import('./modules/element-menu-button'),
		import('./modules/element-settings-panel'),
	]);

	console.log('[Omni Icon] Modules loaded, initializing modal...');

	// Initialize modal container
	renderModal();

	// Expose API to window for Etch controls to use
	(window as any).omniIconPicker = {
		open: (initialValue?: string, callback?: (iconName: string) => void) => {
			openIconPicker(initialValue || '', callback || (() => {}));
		},
		close: closeIconPicker,
	};

	// Set up MutationObserver to watch for icon picker buttons in Etch
	const observeEtchPanel = () => {
		const etchDoc = getEtchIframeDocument();
		if (!etchDoc) return;

		// Look for HTML block properties panel where we can add our icon picker
		const observer = new MutationObserver(() => {
			const etchDoc = getEtchIframeDocument();
			if (!etchDoc) return;

			// Find elements where we can inject icon picker buttons
			// This will depend on how you want to integrate with Etch's UI
			const targetElements = etchDoc.querySelectorAll('.etch-html-block-properties-wrapper:not([data-omni-icon-injected])');
			
			targetElements.forEach((element) => {
				element.setAttribute('data-omni-icon-injected', 'true');
				injectIconPicker(element as HTMLElement);
			});
		});

		// Observe the Etch iframe document for changes
		observer.observe(etchDoc, {
			subtree: true,
			childList: true,
		});

		console.log('[Omni Icon] Etch observer initialized');
	};

	// Function to inject icon picker button into Etch UI
	const injectIconPicker = (containerElement: HTMLElement) => {
		// Create a button to open the icon picker
		const iconPickerButton = document.createElement('button');
		iconPickerButton.type = 'button';
		iconPickerButton.className = 'etch-builder-button etch-builder-button--variant-primary omni-icon-picker-button';
		iconPickerButton.textContent = '🎨 Select Icon';
		iconPickerButton.style.marginTop = '8px';
		
		iconPickerButton.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			
			openIconPicker('', (iconName: string) => {
				console.log('[Omni Icon] Icon selected:', iconName);
				// Insert the icon into the Etch editor
				insertIconIntoEditor(iconName);
			});
		});

		containerElement.appendChild(iconPickerButton);
		console.log('[Omni Icon] Icon picker button injected');
	};

	// Function to insert icon into the Etch editor
	const insertIconIntoEditor = (iconName: string) => {
		const etchDoc = getEtchIframeDocument();
		if (!etchDoc) {
			console.error('[Omni Icon] Could not access Etch iframe document');
			return;
		}

		// Create the icon element
		const iconHTML = `<omni-icon name="${iconName}" width="24" height="24"></omni-icon>`;
		
		// Try to insert at the current selection or cursor position
		try {
			const selection = etchDoc.getSelection();
			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				range.deleteContents();
				
				// Create a temporary container to parse the HTML
				const temp = etchDoc.createElement('div');
				temp.innerHTML = iconHTML;
				
				// Insert the icon
				const iconElement = temp.firstChild;
				if (iconElement) {
					range.insertNode(iconElement);
					range.collapse(false);
					selection.removeAllRanges();
					selection.addRange(range);
				}
			} else {
				// Fallback: insert at the end of the body
				const body = etchDoc.querySelector('body');
				if (body) {
					body.insertAdjacentHTML('beforeend', iconHTML);
				}
			}
			
			console.log('[Omni Icon] Icon inserted into editor:', iconName);
		} catch (error) {
			console.error('[Omni Icon] Error inserting icon:', error);
		}
	};

	// Start observing the Etch panel
	observeEtchPanel();

	console.log('[Omni Icon] Etch integration initialized successfully');
})();
