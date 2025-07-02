(async () => {
  const isoCountry = window.Shopify && Shopify.locale ? Shopify.locale.toLowerCase() : "mx";
  const industry = "cosmetica"; // ← más adelante esto podrá venir desde la App o metafields

  const jsonPath = `/theme/meta/${isoCountry}-${industry}.json`;

  try {
    const response = await fetch(jsonPath);
    const meta = await response.json();

    const block = document.querySelector(".seo-insights-block");
    if (block && meta) {
      if (meta.cta) block.querySelector("h2").textContent = meta.cta;
      if (meta.keywords) block.querySelector("p:nth-of-type(1)").textContent = "Palabras clave: " + meta.keywords;
      if (meta.color) block.querySelector("span").style.color = meta.color;
      if (meta.seo_title) block.querySelector("h3").textContent = meta.seo_title;
      if (meta.seo_description) block.querySelector("p:nth-of-type(2)").textContent = meta.seo_description;
    }
  } catch (error) {
    console.error("No se pudo cargar el archivo de metadatos:", jsonPath, error);
  }
})();
