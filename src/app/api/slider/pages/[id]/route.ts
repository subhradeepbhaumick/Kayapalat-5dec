// File: src/app/api/slider/pages/[id]/route.ts
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const pageId = parseInt(params.id, 10); // Convert the string to a number 
    if (isNaN(pageId)) {
        return NextResponse.json({ error: 'Invalid page ID.' }, { status: 400 });
    }

    const [result]: any = await executeQuery('DELETE FROM sliderpages WHERE id = ?', [pageId]);

    if (result.affectedRows === 0) {
        return NextResponse.json({ error: 'Page not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Page deleted successfully.' });
  } catch (error: any) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return NextResponse.json({ error: 'Cannot delete page. It is in use by one or more sliders.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to delete page.' }, { status: 500 });
  }
}