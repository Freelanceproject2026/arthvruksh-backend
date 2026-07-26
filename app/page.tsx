import { Footer } from '@/components/Footer';
import { getVisitorCount } from '@/lib/services/visitorCounter';

export default async function Home() {
  const initialCount = await getVisitorCount();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <main className="flex flex-1 items-center justify-center">
        <h1>Backend Running</h1>
      </main>

      <Footer initialCount={initialCount} />
    </div>
  );
}
