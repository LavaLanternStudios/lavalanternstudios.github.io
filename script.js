/* ================================
   Lava Lantern Studios - Google Analytics 4
   Measurement ID: G-NHQ7KDPD74

   Privacy behaviour:
   - Analytics is OFF by default.
   - Google Analytics only loads after the visitor accepts analytics cookies.
   - The visitor can change their choice later from the footer.
================================ */

(function setupLavaLanternAnalytics() {
  const measurementId = "G-NHQ7KDPD74";
  const consentStorageKey = "lava_lantern_analytics_consent";
  const acceptedValue = "accepted";
  const rejectedValue = "rejected";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  // Consent Mode defaults must be set before the Google tag is loaded.
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  });

  window.LavaLanternAnalyticsAllowed = false;

  let googleTagLoaded = false;
  let consentBanner = null;

  function readStoredConsent() {
    try {
      return window.localStorage.getItem(consentStorageKey);
    } catch (error) {
      console.warn("Analytics consent preference could not be read.", error);
      return null;
    }
  }

  function storeConsent(value) {
    try {
      window.localStorage.setItem(consentStorageKey, value);
    } catch (error) {
      console.warn("Analytics consent preference could not be saved.", error);
    }
  }

  function setConsentState(granted) {
    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: granted ? "granted" : "denied"
    });

    window.LavaLanternAnalyticsAllowed = granted;

    window.dispatchEvent(
      new CustomEvent("lava-lantern-analytics-consent", {
        detail: { granted }
      })
    );
  }

  function loadGoogleAnalytics() {
    if (googleTagLoaded) {
      return;
    }

    googleTagLoaded = true;
    setConsentState(true);

    const googleTag = document.createElement("script");
    googleTag.async = true;
    googleTag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    googleTag.dataset.lavaLanternAnalytics = "true";
    document.head.appendChild(googleTag);

    // These commands safely queue until gtag.js has finished downloading.
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      send_page_view: true
    });
  }

  function getCookieRootDomain() {
    const hostname = window.location.hostname;
    const parts = hostname.split(".").filter(Boolean);

    if (parts.length < 2 || hostname === "localhost") {
      return null;
    }

    return `.${parts.slice(-2).join(".")}`;
  }

  function clearGoogleAnalyticsCookies() {
    const rootDomain = getCookieRootDomain();

    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();

      if (!name.startsWith("_ga")) {
        return;
      }

      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;

      if (rootDomain) {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=${rootDomain}; SameSite=Lax`;
      }
    });
  }

  function hideConsentBanner() {
    consentBanner?.classList.remove("is-visible");
    consentBanner?.setAttribute("aria-hidden", "true");
  }

  function showConsentBanner() {
    if (!consentBanner) {
      createConsentUI();
    }

    consentBanner?.classList.add("is-visible");
    consentBanner?.setAttribute("aria-hidden", "false");
  }

  function acceptAnalytics() {
    storeConsent(acceptedValue);
    loadGoogleAnalytics();
    hideConsentBanner();
  }

  function rejectAnalytics() {
    storeConsent(rejectedValue);
    setConsentState(false);
    clearGoogleAnalyticsCookies();
    hideConsentBanner();
  }

  function createConsentUI() {
    if (document.querySelector("#lava-analytics-consent")) {
      consentBanner = document.querySelector("#lava-analytics-consent");
      return;
    }

    consentBanner = document.createElement("section");
    consentBanner.id = "lava-analytics-consent";
    consentBanner.className = "analytics-consent-banner";
    consentBanner.setAttribute("role", "dialog");
    consentBanner.setAttribute("aria-modal", "false");
    consentBanner.setAttribute("aria-labelledby", "lava-analytics-consent-title");
    consentBanner.setAttribute("aria-hidden", "true");

    consentBanner.innerHTML = `
      <div class="analytics-consent-copy">
        <strong id="lava-analytics-consent-title">Analytics cookies</strong>
        <p>
          We use Google Analytics to understand website visits and how Lava Lantern Run is played.
          Gameplay analytics are aggregate and do not include personally identifying gameplay information.
        </p>
      </div>

      <div class="analytics-consent-actions">
        <button type="button" class="analytics-consent-button secondary" data-analytics-reject>
          Reject analytics
        </button>
        <button type="button" class="analytics-consent-button" data-analytics-accept>
          Accept analytics
        </button>
      </div>
    `;

    consentBanner
      .querySelector("[data-analytics-accept]")
      ?.addEventListener("click", acceptAnalytics);

    consentBanner
      .querySelector("[data-analytics-reject]")
      ?.addEventListener("click", rejectAnalytics);

    document.body.appendChild(consentBanner);
  }

  function addAnalyticsSettingsButton() {
    const footer = document.querySelector(".site-footer");

    if (!footer || footer.querySelector("[data-analytics-settings]")) {
      return;
    }

    const settingsButton = document.createElement("button");
    settingsButton.type = "button";
    settingsButton.className = "analytics-settings-button";
    settingsButton.dataset.analyticsSettings = "";
    settingsButton.textContent = "Analytics settings";
    settingsButton.addEventListener("click", showConsentBanner);

    footer.appendChild(settingsButton);
  }

  function initialiseAnalytics() {
    createConsentUI();
    addAnalyticsSettingsButton();

    const storedConsent = readStoredConsent();

    if (storedConsent === acceptedValue) {
      loadGoogleAnalytics();
      hideConsentBanner();
      return;
    }

    if (storedConsent === rejectedValue) {
      setConsentState(false);
      hideConsentBanner();
      return;
    }

    showConsentBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseAnalytics, { once: true });
  } else {
    initialiseAnalytics();
  }
})();

/* ================================
   Clean Page URLs
   Hosted: /games instead of /games.html
   Local: clean links reopen the matching .html file
================================ */

(function setupCleanPageURLs() {
  const isLocalFile = window.location.protocol === "file:";

  function splitHref(href) {
    const specialIndexes = [href.indexOf("?"), href.indexOf("#")]
      .filter((index) => index !== -1);
    const cutIndex = specialIndexes.length > 0
      ? Math.min(...specialIndexes)
      : href.length;

    return {
      pathname: href.slice(0, cutIndex),
      suffix: href.slice(cutIndex)
    };
  }

  function getCleanHostedPath(pathname) {
    if (pathname === "/index.html" || pathname.endsWith("/index.html")) {
      return pathname.slice(0, -10) || "/";
    }

    if (pathname.toLowerCase().endsWith(".html")) {
      return pathname.slice(0, -5) || "/";
    }

    return pathname;
  }

  function getLocalHTMLPath(pathname) {
    const cleanPath = pathname.replace(/^\/+|\/+$/g, "");
    const currentPath = window.location.pathname.replace(/\\/g, "/");
    const insidePlayFolder = /\/play\/(?:index\.html)?$/i.test(currentPath);
    const rootPrefix = insidePlayFolder ? "../" : "";

    if (!cleanPath) return `${rootPrefix}index.html`;

    if (cleanPath.toLowerCase() === "play") {
      return `${rootPrefix}play/index.html`;
    }

    if (cleanPath.toLowerCase().endsWith(".html")) {
      return `${rootPrefix}${cleanPath}`;
    }

    return `${rootPrefix}${cleanPath}.html`;
  }

  function normaliseAnchor(anchor) {
    const rawHref = anchor.getAttribute("href");

    if (
      !rawHref ||
      rawHref.startsWith("#") ||
      /^(mailto:|tel:|javascript:|data:)/i.test(rawHref)
    ) {
      return;
    }

    if (isLocalFile) {
      if (!rawHref.startsWith("/")) return;

      const { pathname, suffix } = splitHref(rawHref);
      anchor.setAttribute("href", getLocalHTMLPath(pathname) + suffix);
      return;
    }

    let url;

    try {
      url = new URL(rawHref, window.location.href);
    } catch (error) {
      return;
    }

    if (url.origin !== window.location.origin) return;

    const cleanPath = getCleanHostedPath(url.pathname);
    anchor.setAttribute("href", `${cleanPath}${url.search}${url.hash}`);
  }

  function normaliseLinks(root = document) {
    if (root instanceof HTMLAnchorElement) {
      normaliseAnchor(root);
      return;
    }

    root.querySelectorAll?.("a[href]").forEach(normaliseAnchor);
  }

  if (!isLocalFile) {
    const cleanCurrentPath = getCleanHostedPath(window.location.pathname);

    if (cleanCurrentPath !== window.location.pathname) {
      window.history.replaceState(
        null,
        "",
        `${cleanCurrentPath}${window.location.search}${window.location.hash}`
      );
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    normaliseLinks(document);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            normaliseLinks(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
})();

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");

    const menuIsOpen = siteNav.classList.contains("open");

    menuToggle.setAttribute("aria-expanded", menuIsOpen);

    if (menuIsOpen) {
      menuToggle.textContent = "Close";
    } else {
      menuToggle.textContent = "Menu";
    }
  });
}

const filterButtons = document.querySelectorAll(".filter-button");
const devlogCards = document.querySelectorAll(".devlog-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    devlogCards.forEach((card) => {
      if (filter === "all" || card.dataset.game === filter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

/* ================================
   Games
================================ */

document.addEventListener("DOMContentLoaded", () => {
  const latestGameContainer = document.querySelector("#latest-game-container");
  const gameLibraryGrid = document.querySelector("#game-library-grid");
  const latestGameHeading = document.querySelector("#latest-game-heading");

  // Only run this code on the Games page.
  if (!latestGameContainer || !gameLibraryGrid) {
    return;
  }

  loadGames(latestGameContainer, gameLibraryGrid, latestGameHeading);
});

function loadGames(latestGameContainer, gameLibraryGrid, latestGameHeading) {
  const games = window.games;

  if (!Array.isArray(games) || games.length === 0) {
    latestGameContainer.innerHTML = `
      <p class="game-empty-message">No games have been added yet.</p>
    `;

    gameLibraryGrid.innerHTML = "";

    return;
  }

  const releasedGames = games
    .filter((game) => isGameReleased(game))
    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

  const latestGame = releasedGames.length > 0
    ? releasedGames[0]
    : [...games].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))[0];

  const otherGames = games.filter((game) => game !== latestGame);

  if (latestGameHeading) {
    latestGameHeading.textContent = latestGame.title;
  }

  displayLatestGame(latestGame, latestGameContainer);
  displayOtherGames(otherGames, gameLibraryGrid);
}

function isGameReleased(game) {
  if (typeof game.released === "boolean") {
    return game.released;
  }

  return String(game.released).toLowerCase() === "yes";
}

function isFreeToPlay(price) {
  return String(price).toLowerCase().includes("free");
}

function createGameTags(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "";
  }

  return items
    .map((item) => `<span class="game-info-tag">${item}</span>`)
    .join("");
}

function createGameButton(game) {
  const released = isGameReleased(game);

  if (!released || !game.gameURL) {
    return "";
  }

  const buttonText = isFreeToPlay(game.price) ? "Play Now" : "Buy Now";

  return `
    <a
      class="button"
      href="${game.gameURL}"
      target="_blank"
      rel="noopener noreferrer"
    >
      ${buttonText}
    </a>
  `;
}

function createGameStatusRibbon(game) {
  const released = isGameReleased(game);

  if (released) {
    return `<div class="status-ribbon status-available">Available</div>`;
  }

  return `<div class="status-ribbon status-upcoming">Upcoming</div>`;
}

function displayLatestGame(game, container) {
  container.innerHTML = `
    <article class="latest-game-panel">
      <div class="latest-game-image-wrap">
        ${createGameStatusRibbon(game)}

        <img
          class="latest-game-image"
          src="${game.image}"
          alt="${game.title} game cover"
        />
      </div>

      <div class="latest-game-content">
        <div class="game-tag-row">
          <span class="game-info-tag price-tag">${game.price}</span>
          ${createGameTags(game.platforms)}
        </div>

        <h3>${game.title}</h3>

        <p>
          ${game.description}
        </p>

        <div class="game-tag-row game-detail-tags">
          ${createGameTags(game.tags)}
        </div>

        ${createGameButton(game)}
      </div>
    </article>
  `;
}

function displayOtherGames(games, container) {
  if (!Array.isArray(games) || games.length === 0) {
    container.innerHTML = `
      <p class="game-empty-message">More games and projects will appear here soon.</p>
    `;

    return;
  }

  const orderedGames = [...games].sort((a, b) => {
    const aReleased = isGameReleased(a);
    const bReleased = isGameReleased(b);

    // Upcoming games appear before released games.
    if (aReleased !== bReleased) {
      return aReleased ? 1 : -1;
    }

    // If both are upcoming, show the soonest upcoming date first.
    if (!aReleased && !bReleased) {
      return new Date(a.releaseDate) - new Date(b.releaseDate);
    }

    // If both are released, show the newest released game first.
    return new Date(b.releaseDate) - new Date(a.releaseDate);
  });

  container.innerHTML = orderedGames
    .map((game) => `
      <article class="game-library-card">
        <div class="game-card-image-wrap">
          ${createGameStatusRibbon(game)}

          <img
            class="game-card-image"
            src="${game.image}"
            alt="${game.title} game preview"
          />
        </div>

        <div class="game-card-content">
          <h3>${game.title}</h3>

          <p>
            ${game.description}
          </p>

          <div class="game-tag-row game-card-tags">
            <span class="game-info-tag price-tag">${game.price}</span>
            ${createGameTags(game.tags)}
          </div>

          ${createGameButton(game)}
        </div>
      </article>
    `)
    .join("");
}

/* ================================
   Fab Products
================================ */

document.addEventListener("DOMContentLoaded", () => {
  const latestFabContainer = document.querySelector("#latest-fab-product");
  const fabProductGrid = document.querySelector("#fab-product-grid");

  // Only run this code on the Fab page.
  if (!latestFabContainer || !fabProductGrid) {
    return;
  }

  loadFabProducts(latestFabContainer, fabProductGrid);
});

function loadFabProducts(latestFabContainer, fabProductGrid) {
  const products = window.fabProducts;

  if (!Array.isArray(products) || products.length === 0) {
    latestFabContainer.innerHTML = `
      <p class="empty-message">No Fab products have been added yet.</p>
    `;

    fabProductGrid.innerHTML = "";

    return;
  }

  const sortedProducts = [...products].sort((a, b) => {
    return new Date(b.releaseDate) - new Date(a.releaseDate);
  });

  const latestProduct = sortedProducts[0];
  const otherProducts = sortedProducts.slice(1);

  displayLatestFabProduct(latestProduct, latestFabContainer);
  displayOtherFabProducts(otherProducts, fabProductGrid);
}

function createFabTags(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "";
  }

  return items
    .map((item) => `<span class="fab-tag">${item}</span>`)
    .join("");
}

function displayLatestFabProduct(product, container) {
  container.innerHTML = `
    <article class="latest-fab-card">

      <div class="latest-fab-image">
        <img src="${product.image}" alt="${product.title}">
      </div>

      <div class="latest-fab-content">
        <h3>${product.title}</h3>

        <div class="fab-tag-group">
          ${createFabTags(product.platforms)}
        </div>

        <p class="fab-description">
          ${product.description}
        </p>

        <div class="fab-tag-group fab-keyword-tags">
          ${createFabTags(product.keywords)}
        </div>

        <a 
          class="fab-buy-button" 
          href="${product.fabURL}" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Buy Now
        </a>
      </div>

    </article>
  `;
}

function displayOtherFabProducts(products, container) {
  if (!Array.isArray(products) || products.length === 0) {
    container.innerHTML = `
      <p class="empty-message">More Fab products will appear here soon.</p>
    `;

    return;
  }

  container.innerHTML = products
    .map((product) => `
      <article class="fab-product-card">

        <div class="fab-product-image">
          <img src="${product.image}" alt="${product.title}">
        </div>

        <div class="fab-product-content">
          <h3>${product.title}</h3>

          <div class="fab-tag-group">
            ${createFabTags(product.platforms)}
          </div>

          <a 
            class="fab-buy-button" 
            href="${product.fabURL}" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Buy Now
          </a>
        </div>

      </article>
    `)
    .join("");
}