import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    // Test connection with simple query
    const [testResult] = await executeQuery('SELECT 1 as test');
    console.log('Connection test successful:', testResult);

    // Verify table structure
    const [tableInfo] = await executeQuery(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'blogs'
    `, [process.env.DB_NAME || 'kayapalat_db']);
    
    console.log('Table structure:', tableInfo);

    // Check if we have any blogs
    const [existingBlogs] = await executeQuery('SELECT COUNT(*) as count FROM blogs');
    const blogCount = existingBlogs[0].count;
    console.log('Current blog count:', blogCount);

    // If no blogs, insert dummy data
    if (blogCount === 0) {
      console.log('No blogs found, inserting dummy data...');
      
      const dummyBlogs = [
        {
          title: 'Designing Interiors that Speak',
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem...',
          image: 'https://kayapalat.co/callback/image/?image=/uploads/blogs/blog-67cd6db4a3954.jpeg&width=370&height=373'
        },
        {
          title: 'Modern Living Room Inspirations',
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Temporibus autem quibusdam et aut officiis debitis aut rerum...',
          image: 'https://kayapalat.co/callback/image/?image=/uploads/blogs/blog-67a4eeab58ecd.jpg&width=370&height=373'
        },
        {
          title: 'Maximizing Small Spaces',
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At vero eos et accusamus et iusto odio dignissimos ducimus...',
          image: 'https://kayapalat.co/callback/image/?image=/uploads/blogs/blog-677bb41a77c19.jpg&width=370&height=373'
        }
      ];

      for (const blog of dummyBlogs) {
        await executeQuery(
          'INSERT INTO blogs (title, body, image) VALUES (?, ?, ?)',
          [blog.title, blog.body, blog.image]
        );
      }
      console.log('Dummy data inserted successfully');
    }

    // Fetch all blogs to verify
    const [blogs] = await executeQuery('SELECT * FROM blogs');
    console.log('Total blogs in database:', blogs.length);

    return NextResponse.json({ 
      success: true, 
      connectionTest: testResult,
      tableStructure: tableInfo,
      blogCount: blogs.length,
      blogs: blogs
    });
  } catch (error: any) {
    console.error('Database test error:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    return NextResponse.json(
      { 
        success: false,
        error: 'Database operation failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 