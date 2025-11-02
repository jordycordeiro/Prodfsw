
import Link from 'next/link'
import '@/components/theme/strip-escuro-text'
export default function Landing(){
  return (
    <div className="bg-white text-gray-900">
      <header className="sticky top-0 bg-white shadow z-50">
        <div className="container flex items-center justify-between px-6 py-4">
          <div className="text-xl font-bold">Prodoc ⚕</div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#recursos" className="hover:text-blue-600">Recursos</a>
            <a href="#planos" className="hover:text-blue-600">Planos</a>
          </nav>
          <Link href="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold">Entrar</Link>
        </div>
      </header>
      <section className="px-6 py-16 bg-gradient-to-r from-blue-50 to-white">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-extrabold leading-tight">Prescrição rápida e segura para UPA/UBS</h1>
            <p className="mt-6 text-lg text-gray-600">Sugestões prontas para as principais patologias em <strong>uma só página</strong>.</p>
            <div className="mt-8 flex gap-4">
              <Link href="/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold">Começar agora</Link>
              <a href="/prodoc" className="px-6 py-3 border rounded-lg font-semibold">Demo</a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-[340px] h-[240px] bg-white border rounded-xl shadow-lg p-4">
              <input type="text" placeholder="Pesquisar patologia" className="w-full border rounded-lg px-3 py-2 text-sm mb-4"/>
              <div className="space-y-3">
                <div className="h-10 rounded-lg bg-blue-500" />
                <div className="h-10 rounded-lg bg-gray-200" />
                <div className="h-10 rounded-lg bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
