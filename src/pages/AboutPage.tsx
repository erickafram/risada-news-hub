import React from 'react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AboutPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-6">
          <Link to="/" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página inicial
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white/80 p-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-4">
            Sobre Nós
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-6">
              Bem-vindo ao <strong>memepmw</strong>, seu portal de notícias e entretenimento favorito!
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Nossa Missão</h2>
            <p>
              Nossa missão é fornecer conteúdo de qualidade, atual e relevante sobre entretenimento, 
              cultura pop, celebridades, música, filmes e muito mais. Queremos ser a sua fonte 
              confiável para ficar por dentro de tudo o que está acontecendo no mundo do entretenimento.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Nossa História</h2>
            <p>
              O <strong>memepmw</strong> nasceu da paixão por conteúdo de qualidade e da vontade de 
              criar um espaço onde os amantes de entretenimento pudessem encontrar notícias, 
              análises e conteúdo exclusivo.
            </p>
            <p>
              Desde o nosso início, temos nos dedicado a crescer e evoluir, sempre com o compromisso 
              de oferecer o melhor conteúdo para nossos leitores.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Nossa Equipe</h2>
            <p>
              Contamos com uma equipe de redatores e especialistas apaixonados por entretenimento e 
              cultura pop. Cada membro traz sua experiência e conhecimento único para criar conteúdo 
              diversificado e de qualidade.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Nossos Valores</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Qualidade:</strong> Comprometidos com a excelência em tudo o que fazemos.</li>
              <li><strong>Integridade:</strong> Mantemos os mais altos padrões éticos em nosso trabalho.</li>
              <li><strong>Criatividade:</strong> Buscamos constantemente novas formas de entreter e informar.</li>
              <li><strong>Comunidade:</strong> Valorizamos nossos leitores e a comunidade que construímos juntos.</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Entre em Contato</h2>
            <p>
              Queremos ouvir de você! Tem sugestões, comentários ou dúvidas? 
              Visite nossa <Link to="/contact" className="text-primary hover:underline">página de contato</Link> 
              para falar conosco.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
