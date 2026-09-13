/* ================================
   Lava Lantern Run - Website Wrapper
================================ */

(() => {
  const canvas = document.querySelector("#unity-canvas");
  const loadingBar = document.querySelector("#unity-loading-bar");
  const progressBar = document.querySelector("#unity-progress-bar-full");
  const progressTrack = document.querySelector("#unity-progress-track");
  const loadingStatus = document.querySelector("#unity-loading-status");
  const warningBanner = document.querySelector("#unity-warning");
  const fullscreenButton = document.querySelector("#play-fullscreen-button");
  const gameArea = document.querySelector(".play-game-area");

  let unityInstance = null;
  let viewportMode = false;

  if (!canvas) {
    return;
  }

  /*
     Unity calls this function through the existing .jslib bridge.
     If GA4 is added later, gtag events are sent automatically.
     Until then, events remain visible in the browser console so the
     integration can be tested without breaking gameplay.
  */
  window.LavaLanternAnalyticsTrack = function (
    eventName,
    parameterName,
    value
  ) {
    if (!eventName) {
      return;
    }

    const parameters = {};

    if (parameterName) {
      const numericValue = Number(value);
      const hasNumericValue =
        value !== null &&
        value !== "" &&
        Number.isFinite(numericValue);

      parameters[parameterName] = hasNumericValue ? numericValue : value;

      /*
         Keep the numeric `score` parameter for the GA4 custom metric,
         and also send the same result under a second parameter so GA4
         can register it as an event-scoped custom dimension for an
         exact score / high-score table.
      */
      if (
        eventName === "score_achieved" &&
        parameterName === "score" &&
        hasNumericValue
      ) {
        parameters.score_result = numericValue;
      }
    }

    if (
      window.LavaLanternAnalyticsAllowed === true &&
      typeof window.gtag === "function"
    ) {
      window.gtag("event", eventName, parameters);
      return;
    }

    console.info(
      "[Lava Lantern Analytics - not sent until analytics consent is granted]",
      eventName,
      Object.keys(parameters).length ? parameters : ""
    );
  };

  function unityShowBanner(message, type) {
    if (!warningBanner) {
      return;
    }

    const item = document.createElement("div");
    item.className = `play-warning-message ${type || "info"}`;
    item.textContent = message;
    warningBanner.appendChild(item);

    if (type !== "error") {
      window.setTimeout(() => {
        item.remove();
      }, 5000);
    }
  }

  const buildUrl = "Build";
  const loaderUrl = `${buildUrl}/LavaLanternRun_1.0.0_Website.loader.js`;

  const config = {
    arguments: [],
    dataUrl: `${buildUrl}/LavaLanternRun_1.0.0_Website.data.unityweb`,
    frameworkUrl: `${buildUrl}/LavaLanternRun_1.0.0_Website.framework.js.unityweb`,
    codeUrl: `${buildUrl}/LavaLanternRun_1.0.0_Website.wasm.unityweb`,
    symbolsUrl: `${buildUrl}/LavaLanternRun_1.0.0_Website.symbols.json.unityweb`,
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Lava Lantern Studios",
    productName: "Lava Lantern Run",
    productVersion: "1.0.0",
    showBanner: unityShowBanner
  };

  function setLoadingProgress(progress) {
    const percent = Math.round(progress * 100);

    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }

    if (progressTrack) {
      progressTrack.setAttribute("aria-valuenow", String(percent));
    }

    if (loadingStatus) {
      loadingStatus.textContent = `Loading game… ${percent}%`;
    }
  }

  function finishLoading() {
    if (loadingStatus) {
      loadingStatus.textContent = "Ready!";
    }

    window.setTimeout(() => {
      loadingBar?.classList.add("is-hidden");
      canvas.focus({ preventScroll: true });
    }, 180);

    if (fullscreenButton) {
      fullscreenButton.disabled = false;
    }
  }

  function getFullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function setFullscreenButtonLabel() {
    if (!fullscreenButton) {
      return;
    }

    const isFullscreen = Boolean(getFullscreenElement()) || viewportMode;
    fullscreenButton.textContent = isFullscreen ? "Exit Fullscreen" : "Fullscreen";
  }

  function setViewportMode(enabled) {
    viewportMode = enabled;
    document.body.classList.toggle("play-viewport-mode", enabled);
    setFullscreenButtonLabel();

    window.setTimeout(() => {
      canvas.focus({ preventScroll: true });
      window.dispatchEvent(new Event("resize"));
    }, 50);
  }

  async function enterBrowserFullscreen() {
    if (!gameArea) {
      setViewportMode(true);
      return;
    }

    try {
      if (gameArea.requestFullscreen) {
        await gameArea.requestFullscreen();
        return;
      }

      if (gameArea.webkitRequestFullscreen) {
        gameArea.webkitRequestFullscreen();
        return;
      }
    } catch (error) {
      console.warn(
        "Browser fullscreen was unavailable; using viewport mode instead.",
        error
      );
    }

    /* iOS/Safari fallback: cover the viewport while preserving 9:16. */
    setViewportMode(true);
  }

  async function exitBrowserFullscreen() {
    try {
      if (document.exitFullscreen && document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      if (document.webkitExitFullscreen && document.webkitFullscreenElement) {
        document.webkitExitFullscreen();
        return;
      }
    } catch (error) {
      console.warn("Could not exit browser fullscreen normally.", error);
    }

    if (viewportMode) {
      setViewportMode(false);
    }
  }

  function toggleFullscreen() {
    if (!unityInstance) {
      return;
    }

    if (getFullscreenElement() || viewportMode) {
      exitBrowserFullscreen();
      return;
    }

    /*
       IMPORTANT: We fullscreen the WEBSITE WRAPPER, not Unity itself.
       The wrapper always contains a strict 9:16 game frame, so fullscreen
       can only add black letterboxing/pillarboxing around the game.
    */
    enterBrowserFullscreen();
  }

  document.addEventListener("fullscreenchange", () => {
    setFullscreenButtonLabel();
    window.setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
  });

  document.addEventListener("webkitfullscreenchange", () => {
    setFullscreenButtonLabel();
    window.setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
  });

  fullscreenButton?.addEventListener("click", toggleFullscreen);

  /* Escape also exits the browser-viewport fallback mode. */
  document.addEventListener("keydown", (event) => {
    if (event.code === "Escape" && viewportMode) {
      setViewportMode(false);
    }

    /* Prevent the browser from scrolling the page when Space is used to jump. */
    if (
      event.code === "Space" &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      !/INPUT|TEXTAREA|SELECT|BUTTON/.test(document.activeElement?.tagName || "")
    ) {
      event.preventDefault();
    }
  });

  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  const loaderScript = document.createElement("script");
  loaderScript.src = loaderUrl;
  loaderScript.async = true;

  loaderScript.onload = () => {
    createUnityInstance(canvas, config, setLoadingProgress)
      .then((instance) => {
        unityInstance = instance;
        finishLoading();
      })
      .catch((error) => {
        console.error(error);
        unityShowBanner(String(error), "error");

        if (loadingStatus) {
          loadingStatus.textContent = "The game could not be loaded. Please refresh and try again.";
        }
      });
  };

  loaderScript.onerror = () => {
    unityShowBanner("The Unity loader could not be downloaded.", "error");

    if (loadingStatus) {
      loadingStatus.textContent = "The game could not be loaded. Please refresh and try again.";
    }
  };

  document.body.appendChild(loaderScript);
})();
