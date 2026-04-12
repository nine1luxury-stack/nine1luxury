import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // This will work once you have a 'todos' table in your Supabase project
  const { data: todos, error } = await supabase.from('todos').select()

  if (error) {
     console.error('Supabase error:', error);
  }

  return (
    <div className="p-10 bg-rich-black min-h-screen text-ivory">
        <h1 className="text-3xl font-black mb-8 tracking-widest text-gold-500 uppercase">Supabase Todo Test</h1>
        
        {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mb-6">
                Error connecting to Supabase: {error.message}
            </div>
        )}

        <ul className="space-y-4">
            {todos?.map((todo: any) => (
                <li key={todo.id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    {todo.name}
                </li>
            ))}
            {(!todos || todos.length === 0) && !error && (
                <p className="text-champagne/40 lowercase tracking-widest text-sm italic">
                    No todos found. If you just created the table, make sure to add some rows!
                </p>
            )}
        </ul>
    </div>
  )
}
