import Link from 'next/link';
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center px-8 py-5 border-b border-border">
        <span className="font-bold text-xl text-primary">FretesApp</span>
        <nav className="flex gap-4">
          <Link href="/login" className="text-text hover:underline">Entrar</Link>
          <Link href="/cadastro" className="bg-primary text-white px-4 py-2 rounded-md">Cadastrar</Link>
        </nav>
      </header>
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary max-w-3xl">Conectamos embarcadores e caminhoneiros em minutos</h1>
        <p className="mt-4 text-lg text-muted max-w-2xl">Publique sua carga ou encontre fretes compatíveis.</p>
        <div className="mt-8 flex gap-3">
          <Link href="/cadastro" className="bg-ctaAccept text-black font-semibold px-6 py-3 rounded-md">Começar agora</Link>
          <Link href="/fretes" className="border border-primary text-primary px-6 py-3 rounded-md">Ver fretes</Link>
        </div>
      </section>
    </main>
  );
}
