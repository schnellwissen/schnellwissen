const MAP: Record<string,string> = { ä:'ae', ö:'oe', ü:'ue', ß:'ss', Ä:'ae', Ö:'oe', Ü:'ue' };

export function slugify(input: string): string {
  if (!input) return '';
  let s = input.trim().replace(/[ÄÖÜäöüß]/g, m => MAP[m] || m);
  s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  s = s.replace(/[^a-z0-9]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
  return s;
}