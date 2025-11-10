/**
 * Service Worker Registration
 * Copyright 2025 Elysium OSS
 */

if ("serviceWorker" in navigator) {
	window.addEventListener("load", async () => {
		try {
			const registration = await navigator.serviceWorker.register(
				"/service-worker.js",
				{
					scope: "/",
				},
			);

			console.log(
				"[SW] Service Worker registered successfully:",
				registration.scope,
			);

			// Check for updates
			registration.addEventListener("updatefound", () => {
				const newWorker = registration.installing;

				if (newWorker) {
					newWorker.addEventListener("statechange", () => {
						if (
							newWorker.state === "installed" &&
							navigator.serviceWorker.controller
						) {
							// New service worker available
							console.log("[SW] New service worker available");

							// Show update notification to user
							showUpdateNotification(newWorker);
						}
					});
				}
			});

			// Handle controller change
			let refreshing = false;
			navigator.serviceWorker.addEventListener("controllerchange", () => {
				if (!refreshing) {
					refreshing = true;
					window.location.reload();
				}
			});
		} catch (error) {
			console.error("[SW] Service Worker registration failed:", error);
		}
	});
}

/**
 * Show update notification to user
 */
function showUpdateNotification(worker) {
	// Create a simple notification banner
	const banner = document.createElement("div");
	banner.id = "sw-update-banner";
	banner.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(15, 10, 26, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(167, 139, 250, 0.3);
    border-radius: 12px;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    z-index: 10000;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    animation: slideUp 0.3s ease;
    max-width: 90%;
    width: 400px;
  `;

	banner.innerHTML = `
    <div style="flex: 1; color: rgba(255, 255, 255, 0.9); font-size: 0.95rem;">
      New version available!
    </div>
    <button id="sw-update-button" style="
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.9));
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    ">
      Update
    </button>
    <button id="sw-dismiss-button" style="
      background: transparent;
      color: rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    ">
      Dismiss
    </button>
  `;

	// Add animation
	const style = document.createElement("style");
	style.textContent = `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
    #sw-update-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
    }
    #sw-dismiss-button:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.4);
    }
  `;
	document.head.appendChild(style);

	document.body.appendChild(banner);

	// Update button click
	document.getElementById("sw-update-button")?.addEventListener("click", () => {
		worker.postMessage({ type: "SKIP_WAITING" });
	});

	// Dismiss button click
	document
		.getElementById("sw-dismiss-button")
		?.addEventListener("click", () => {
			banner.remove();
		});
}

/**
 * Request notification permission (optional)
 */
async function requestNotificationPermission() {
	if ("Notification" in window && Notification.permission === "default") {
		try {
			const permission = await Notification.requestPermission();
			console.log("[SW] Notification permission:", permission);
		} catch (error) {
			console.error("[SW] Notification permission error:", error);
		}
	}
}

// Export for use in other modules
window.swRegistration = {
	requestNotificationPermission,
};
