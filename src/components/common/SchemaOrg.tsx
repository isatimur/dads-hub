export const WebsiteSchema = () => {
  return (
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Отец Молодец",
        "url": "https://otec-molodec.ru",
        "logo": "https://otec-molodec.ru/logo.png",
        "sameAs": [
          "https://facebook.com/otecmolodec",
          "https://vk.com/otecmolodec"
        ]
      })}
    </script>
  );
}; 