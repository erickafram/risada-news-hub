import React from 'react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPage = () => {
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
            Política de Privacidade
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-6">
              A sua privacidade é importante para nós. É política do <strong>memepmw</strong> respeitar a 
              sua privacidade em relação a qualquer informação sua que possamos coletar em nosso 
              site, e outros sites que possuímos e operamos.
            </p>
            
            <p>
              Esta política de privacidade foi atualizada em {new Date().toLocaleDateString('pt-BR')}.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Informações que coletamos</h2>
            <p>
              Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe
              fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e
              consentimento. Também informamos por que estamos coletando e como será usado.
            </p>
            
            <p>
              Quando você se registra em nosso site, podemos coletar as seguintes informações:
            </p>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>Nome</li>
              <li>Endereço de e-mail</li>
              <li>Informações de perfil, como foto e biografia</li>
              <li>Endereço IP e informações do navegador</li>
              <li>Cookies e dados de rastreamento</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Como usamos suas informações</h2>
            <p>
              Usamos as informações coletadas das seguintes formas:
            </p>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>Fornecer, operar e manter nosso site</li>
              <li>Melhorar, personalizar e expandir nosso site</li>
              <li>Entender e analisar como você usa nosso site</li>
              <li>Desenvolver novos produtos, serviços, recursos e funcionalidades</li>
              <li>Comunicar com você, diretamente ou através de parceiros, incluindo para atendimento ao cliente</li>
              <li>Enviar e-mails de atualização</li>
              <li>Encontrar e prevenir fraudes</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Cookies</h2>
            <p>
              Utilizamos cookies para ajudar a personalizar sua experiência. Cookies são pequenos arquivos
              de texto que são armazenados em seu dispositivo. Eles nos ajudam a analisar como os usuários
              navegam em nosso site, melhorar nossos serviços e personalizar o conteúdo exibido.
            </p>
            
            <p>
              Você pode escolher aceitar ou recusar cookies. A maioria dos navegadores aceita cookies
              automaticamente, mas você geralmente pode modificar as configurações do seu navegador
              para recusar cookies, se preferir.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Retenção de dados</h2>
            <p>
              Mantemos suas informações pessoais apenas pelo tempo necessário para os fins estabelecidos
              nesta política ou conforme exigido por lei. Quando não precisarmos mais usar suas informações,
              iremos removê-las de nossos sistemas ou anonimizá-las para que você não possa ser identificado.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Seus direitos</h2>
            <p>
              Você tem os seguintes direitos relacionados às suas informações pessoais:
            </p>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>O direito de ser informado sobre como seus dados são usados</li>
              <li>O direito de acessar as informações pessoais que temos sobre você</li>
              <li>O direito de solicitar a correção de informações imprecisas</li>
              <li>O direito de solicitar a exclusão de suas informações</li>
              <li>O direito de solicitar que restrinjamos o processamento de seus dados</li>
              <li>O direito à portabilidade de dados</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Alterações nesta política</h2>
            <p>
              Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre
              quaisquer alterações publicando a nova Política de Privacidade nesta página e, se as alterações
              forem significativas, enviaremos um aviso por e-mail.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Contato</h2>
            <p>
              Se você tiver alguma dúvida sobre esta Política de Privacidade, por favor entre em contato conosco:
            </p>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>Por e-mail: privacidade@memepmw.com</li>
              <li>Através de nossa <Link to="/contact" className="text-primary hover:underline">página de contato</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
