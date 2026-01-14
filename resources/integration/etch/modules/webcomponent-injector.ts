/**
 * Web Component Injector for Etch iframe
 * 
 * This module injects the omni-icon web component script into the Etch iframe
 * so icons can be rendered inside the editor.
 */

// Helper function to get the Etch iframe element
const getEtchIframe = (): HTMLIFrameElement | null => {
	return document.getElementById('etch-iframe') as HTMLIFrameElement;
};

async function injectWebComponent() {
	const iframeEl = getEtchIframe();
	if (!iframeEl) {
		console.error('[Omni Icon] Etch iframe not found');
		return;
	}

	console.log('[Omni Icon] Finding omni-icon web component script...');

	// Timeout flag and timer to limit the search duration
	let timeoutOccurred = false;
	const timeout = setTimeout(() => {
		timeoutOccurred = true;
	}, 45000); // 45 seconds timeout

	let scriptElements: HTMLScriptElement[] = [];

	// Wait for the script to be available in the parent document
	while (!timeoutOccurred) {
		const allScripts = document.querySelectorAll('script');

		// Filter scripts to find omni-icon web component scripts
		// Look for scripts with id containing 'omni-icon:web-component' or 'vite-client'
		scriptElements = Array.from(allScripts).filter(scriptElement => {
			const id = scriptElement.getAttribute('id');
			const src = scriptElement.getAttribute('src');
			
			// Match omni-icon web component or vite client scripts
			return (id && (id.includes('omni-icon:web-component') || id.startsWith('vite-client'))) ||
				   (src && src.includes('omni-icon'));
		});

		if (scriptElements.length > 0) {
			clearTimeout(timeout);
			break;
		}

		await new Promise(resolve => setTimeout(resolve, 100));
	}

	if (timeoutOccurred) {
		console.error('[Omni Icon] Timeout! Failed to find omni-icon web component script');
		return;
	}

	console.log('[Omni Icon] Found omni-icon web component script', scriptElements);

	const contentWindow = iframeEl.contentWindow;
	const contentDocument = iframeEl.contentDocument || contentWindow?.document;

	if (!contentWindow || !contentDocument) {
		console.error('[Omni Icon] Cannot access iframe content');
		return;
	}

	// Wait until contentDocument.head is available
	while (!contentDocument.head) {
		await new Promise(resolve => setTimeout(resolve, 300));
	}

	console.log('[Omni Icon] Injecting omni-icon web component into iframe...');

	// Check if script is already injected
	const injectedScripts = contentDocument.querySelectorAll('script');
	const isScriptInjected = Array.from(injectedScripts).some(script => {
		const id = script.getAttribute('id');
		const src = script.getAttribute('src');
		return (id && id.includes('omni-icon:web-component')) ||
			   (src && src.includes('omni-icon'));
	});

	if (!isScriptInjected) {
		console.log('[Omni Icon] Starting injection process...');
		
		// Inject each script element
		scriptElements.forEach(scriptElement => {
			const id = scriptElement.getAttribute('id');
			
			// Clone the script element
			const clonedScript = contentDocument.createElement('script');
			
			// Copy all attributes
			Array.from(scriptElement.attributes).forEach(attr => {
				clonedScript.setAttribute(attr.name, attr.value);
			});
			
			// Copy script content if it's inline
			if (!scriptElement.src && scriptElement.textContent) {
				clonedScript.textContent = scriptElement.textContent;
			}
			
			// Inject into head or body based on script type
			if (id && (id.includes('metadata') || id.startsWith('vite-client'))) {
				contentDocument.head.appendChild(clonedScript);
			} else {
				contentDocument.body.appendChild(clonedScript);
			}
		});
		
		// Also inject the REST API configuration
		const configScript = contentDocument.createElement('script');
		configScript.textContent = `
			window.omniIconConfig = {
				restUrl: '${(window as any).omniIconEtch?.restUrl || ''}',
				nonce: '${(window as any).omniIconEtch?.nonce || ''}'
			};
		`;
		contentDocument.head.appendChild(configScript);
		
		console.log('[Omni Icon] Web component injected successfully');
	} else {
		console.log('[Omni Icon] Web component already injected, skipping...');
	}

	iframeEl.dataset.omniIconInjected = 'true';
}

// Set up MutationObserver to watch for iframe changes
const observer = new MutationObserver(() => {
	const target = getEtchIframe();

	if (target && !target.dataset.omniIconInjected) {
		setTimeout(() => {
			if (target.dataset.omniIconInjected) {
				return; // Already injected
			}

			injectWebComponent();
		}, 100); // Delay to ensure the iframe is fully loaded
	}
});

// Start observing
observer.observe(document, {
	subtree: true,
	childList: true,
});

console.log('[Omni Icon] Web component injector module loaded');
