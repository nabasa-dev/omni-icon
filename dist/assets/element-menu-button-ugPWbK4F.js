var e=()=>window.omniIconPicker,t=(e,t=`success`)=>{let n=document.createElement(`div`);if(n.className=`omni-icon-toast omni-icon-toast-${t}`,n.textContent=e,n.style.cssText=`
		position: fixed;
		top: 20px;
		right: 20px;
		background: ${t===`success`?`#28a745`:`#dc3545`};
		color: white;
		padding: 12px 20px;
		border-radius: 4px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.2);
		z-index: 999999;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
		font-size: 14px;
		animation: omniIconToastSlideIn 0.3s ease-out;
	`,!document.getElementById(`omni-icon-toast-styles`)){let e=document.createElement(`style`);e.id=`omni-icon-toast-styles`,e.textContent=`
			@keyframes omniIconToastSlideIn {
				from {
					transform: translateX(400px);
					opacity: 0;
				}
				to {
					transform: translateX(0);
					opacity: 1;
				}
			}
			@keyframes omniIconToastSlideOut {
				from {
					transform: translateX(0);
					opacity: 1;
				}
				to {
					transform: translateX(400px);
					opacity: 0;
				}
			}
		`,document.head.appendChild(e)}document.body.appendChild(n),setTimeout(()=>{n.style.animation=`omniIconToastSlideOut 0.3s ease-in`,setTimeout(()=>n.remove(),300)},3e3)},n=async e=>{let n=`<omni-icon name="${e}" width="32" height="32"></omni-icon>`;try{return await navigator.clipboard.writeText(n),console.log(`[Omni Icon] Copied to clipboard:`,n),t(`✓ Icon HTML copied to clipboard! Paste it into the editor.`,`success`),!0}catch(e){return console.error(`[Omni Icon] Failed to copy to clipboard:`,e),prompt(`Copy this icon HTML:`,n)===null?(t(`Failed to copy icon HTML`,`error`),!1):(t(`Icon HTML ready to paste!`,`success`),!0)}},r=()=>{let r=document.createElement(`button`);return r.setAttribute(`id`,`omni-icon-element-button`),r.setAttribute(`aria-label`,`Add Omni Icon (copies HTML to clipboard)`),r.setAttribute(`class`,`element-button`),r.setAttribute(`type`,`button`),r.innerHTML=`
		<div class="icon-wrapper">
			<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" class="etch-icon iconify iconify--omni-icon" width="16px" height="16px" viewBox="0 0 400 400">
				<path fill="currentColor" fill-rule="evenodd" d="M 0 0 H 400 V 400 H 0 Z M 195 61 L 158 99 L 400 333 L 400 259 Z M 0 75 L 0 149 L 195 339 L 232 301 Z" />
			</svg>
		</div>
	`,r.addEventListener(`click`,r=>{r.preventDefault(),r.stopPropagation();let i=e();if(!i){console.error(`[Omni Icon] Icon picker API not available`),t(`Icon picker not available`,`error`);return}i.open(``,async e=>{e&&await n(e)})}),r},i=()=>{let e=document.querySelector(`div.element-menu`);if(!e)return console.warn(`[Omni Icon] Element menu not found`),!1;if(e.querySelector(`#omni-icon-element-button`))return!0;let t=r();return e.appendChild(t),console.log(`[Omni Icon] Element menu button injected successfully`),!0};new MutationObserver(()=>{i()}).observe(document.body,{subtree:!0,childList:!0}),setTimeout(()=>{i()},500),console.log(`[Omni Icon] Element menu button module loaded`);