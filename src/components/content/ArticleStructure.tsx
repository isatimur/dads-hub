export const ArticleStructure: React.FC<ArticleProps> = ({ 
  title, 
  content,
  author,
  date,
  category 
}) => {
  return (
    <article itemScope itemType="http://schema.org/Article">
      <h1 itemProp="headline">{title}</h1>
      
      <div className="article-meta">
        <span itemProp="author">{author}</span>
        <time itemProp="datePublished" dateTime={date}>
          {formatDate(date)}
        </time>
        <span itemProp="articleSection">{category}</span>
      </div>

      <div 
        itemProp="articleBody"
        className="content prose prose-lg max-w-none"
      >
        {content}
      </div>
    </article>
  );
}; 