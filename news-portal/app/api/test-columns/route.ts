import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    const sb = await supabaseServer();
    
    // Get one article to see its structure
    const { data: sample, error } = await sb
      .from('articles')
      .select('*')
      .limit(1)
      .single();
    
    if (sample) {
      return NextResponse.json({
        columns: Object.keys(sample),
        sample: sample
      });
    }
    
    // If no articles, try to insert a test one to see what columns are required
    const { error: insertError } = await sb
      .from('articles')
      .insert({
        title: 'Test',
        slug: 'test',
        status: 'draft'
      });
    
    return NextResponse.json({
      message: 'No articles found',
      insertError: insertError?.message || 'No error details'
    });
    
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}