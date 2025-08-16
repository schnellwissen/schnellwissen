import Avatar from "@/components/Avatar";

interface ArticleMetaProps {
  date: string;
  viewsLabel: string;
  author?: {
    name: string;
    image: string;
  };
}

export default function ArticleMeta({ date, viewsLabel, author }: ArticleMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
      {/* Aufrufe */}
      <span className="inline-flex items-center gap-1">
        <svg 
          viewBox="0 0 24 24" 
          className="h-4 w-4" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.6"
        >
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        <span title={viewsLabel}>
          {viewsLabel}
        </span>
      </span>

      {/* Datum */}
      <span className="inline-flex items-center gap-1">
        <svg 
          viewBox="0 0 24 24" 
          className="h-4 w-4" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.6"
        >
          <path d="M8 2v3M16 2v3M4 10h16M6 6h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"/>
        </svg>
        {date}
      </span>

      {/* Autor - prominenter dargestellt */}
      {author ? (
        <span className="inline-flex items-center gap-2.5 pl-4 border-l border-slate-200">
          {/* Mobile: 36px, Desktop: 40px */}
          <div className="sm:hidden">
            <Avatar name={author.name} src={author.image} size={36} />
          </div>
          <div className="hidden sm:block">
            <Avatar name={author.name} src={author.image} size={40} />
          </div>
          <span className="font-medium text-slate-800">{author.name}</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-2.5 pl-4 border-l border-slate-200">
          <Avatar name="Redaktion" size={36} className="sm:hidden" />
          <Avatar name="Redaktion" size={40} className="hidden sm:block" />
          <span className="font-medium text-slate-700">Redaktion</span>
        </span>
      )}
    </div>
  );
}