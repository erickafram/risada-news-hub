'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const defaultPages = [
      {
        title: 'Sobre Nós',
        slug: 'sobre-nos',
        content: `
<h1>Sobre o Risada News Hub</h1>

<p>Bem-vindo ao Risada News Hub, seu portal de notícias e entretenimento dedicado a trazer um sorriso ao seu dia!</p>

<h2>Nossa Missão</h2>

<p>No Risada News Hub, acreditamos que as notícias não precisam ser sempre sérias e pesadas. Nossa missão é informar e entreter, trazendo conteúdo relevante com um toque de humor e leveza.</p>

<p>Fundado em 2025, nosso portal rapidamente se tornou uma referência para quem busca se manter informado sem perder o bom humor.</p>

<h2>Nossa Equipe</h2>

<p>Contamos com uma equipe diversificada de jornalistas, redatores e criadores de conteúdo apaixonados por comunicação e entretenimento. Todos compartilham o compromisso de trazer informações precisas e conteúdo de qualidade.</p>

<h2>Nossos Valores</h2>

<ul>
  <li><strong>Credibilidade:</strong> Comprometimento com a verdade e a precisão das informações</li>
  <li><strong>Criatividade:</strong> Abordagem inovadora e bem-humorada para as notícias</li>
  <li><strong>Respeito:</strong> Valorização da diversidade de opiniões e perspectivas</li>
  <li><strong>Acessibilidade:</strong> Conteúdo disponível para todos, em linguagem clara e acessível</li>
</ul>

<h2>Nossas Categorias</h2>

<p>Cobrimos uma ampla variedade de tópicos, incluindo:</p>

<ul>
  <li>Entretenimento</li>
  <li>Cultura Pop</li>
  <li>Tecnologia</li>
  <li>Estilo de Vida</li>
  <li>Curiosidades</li>
  <li>E muito mais!</li>
</ul>

<h2>Entre em Contato</h2>

<p>Tem sugestões, dúvidas ou quer fazer parte da nossa equipe? Entre em contato conosco através da nossa <a href="/contato">página de contato</a>.</p>

<p>Obrigado por fazer parte da comunidade Risada News Hub!</p>
        `,
        meta_title: 'Sobre Nós | Risada News Hub',
        meta_description: 'Conheça a história, missão e valores do Risada News Hub, seu portal de notícias e entretenimento.',
        featured_image: '/uploads/images/about-page.jpg',
        status: 'published',
        show_in_menu: true,
        menu_order: 1,
        author_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Contato',
        slug: 'contato',
        content: `
<h1>Entre em Contato</h1>

<p>Estamos sempre abertos para ouvir sugestões, críticas construtivas ou simplesmente bater um papo. Utilize o formulário abaixo ou os canais alternativos para entrar em contato conosco.</p>

<div class="contact-form-container">
  <form id="contact-form" class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium">Nome</label>
      <input type="text" id="name" name="name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
    </div>
    
    <div>
      <label for="email" class="block text-sm font-medium">E-mail</label>
      <input type="email" id="email" name="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
    </div>
    
    <div>
      <label for="subject" class="block text-sm font-medium">Assunto</label>
      <input type="text" id="subject" name="subject" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
    </div>
    
    <div>
      <label for="message" class="block text-sm font-medium">Mensagem</label>
      <textarea id="message" name="message" rows="5" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required></textarea>
    </div>
    
    <div>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Enviar Mensagem</button>
    </div>
  </form>
</div>

<h2 class="mt-8">Outras Formas de Contato</h2>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
  <div>
    <h3>E-mail</h3>
    <p>contato@risadanews.com.br</p>
    <p>redacao@risadanews.com.br</p>
  </div>
  
  <div>
    <h3>Redes Sociais</h3>
    <p>Instagram: @risadanewshub</p>
    <p>Twitter: @risadanews</p>
    <p>Facebook: /risadanewshub</p>
  </div>
</div>

<h2 class="mt-8">Localização</h2>

<p>Av. Paulista, 1000 - Bela Vista<br>
São Paulo - SP, 01310-100<br>
Brasil</p>

<div class="mt-4">
  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0976469797574!2d-46.65499492386094!3d-23.564101178544267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c7f481fd9f%3A0x9982bfde4df54830!2sAv.%20Paulista%2C%201000%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-100!5e0!3m2!1spt-BR!2sbr!4v1682531245781!5m2!1spt-BR!2sbr" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div>
        `,
        meta_title: 'Contato | Risada News Hub',
        meta_description: 'Entre em contato com a equipe do Risada News Hub. Estamos sempre abertos para ouvir sugestões, críticas construtivas ou simplesmente bater um papo.',
        featured_image: '/uploads/images/contact-page.jpg',
        status: 'published',
        show_in_menu: true,
        menu_order: 2,
        author_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Política de Privacidade',
        slug: 'politica-de-privacidade',
        content: `
<h1>Política de Privacidade</h1>

<p>Última atualização: 26 de abril de 2025</p>

<p>Esta Política de Privacidade descreve como o Risada News Hub ("nós", "nosso" ou "site") coleta, usa e compartilha suas informações pessoais quando você visita ou interage com nosso site.</p>

<h2>Informações que Coletamos</h2>

<p>Coletamos diferentes tipos de informações para diversos fins, visando fornecer e melhorar nossos serviços para você.</p>

<h3>Informações Pessoais</h3>

<p>Ao se cadastrar em nosso site, podemos solicitar algumas informações pessoais, como:</p>

<ul>
  <li>Nome completo</li>
  <li>Endereço de e-mail</li>
  <li>Número de telefone (opcional)</li>
  <li>Foto de perfil (opcional)</li>
</ul>

<h3>Informações de Uso</h3>

<p>Também coletamos informações sobre como você acessa e usa nosso site, incluindo:</p>

<ul>
  <li>Endereço IP</li>
  <li>Tipo de navegador</li>
  <li>Páginas visitadas</li>
  <li>Tempo gasto no site</li>
  <li>Links clicados</li>
  <li>Interações com o conteúdo</li>
</ul>

<h2>Como Usamos Suas Informações</h2>

<p>Utilizamos as informações coletadas para:</p>

<ul>
  <li>Fornecer, operar e manter nosso site</li>
  <li>Melhorar, personalizar e expandir nosso site</li>
  <li>Entender e analisar como você usa nosso site</li>
  <li>Desenvolver novos produtos, serviços e funcionalidades</li>
  <li>Comunicar-nos com você, diretamente ou através de parceiros, incluindo atendimento ao cliente</li>
  <li>Enviar e-mails informativos e newsletters (com sua permissão)</li>
  <li>Encontrar e prevenir fraudes</li>
</ul>

<h2>Cookies e Tecnologias Semelhantes</h2>

<p>Utilizamos cookies e tecnologias semelhantes para rastrear a atividade em nosso site e armazenar certas informações. Os cookies são arquivos com pequena quantidade de dados que podem incluir um identificador exclusivo anônimo.</p>

<p>Você pode instruir seu navegador a recusar todos os cookies ou indicar quando um cookie está sendo enviado. No entanto, se você não aceitar cookies, talvez não consiga usar algumas partes do nosso site.</p>

<h2>Compartilhamento de Informações</h2>

<p>Não compartilhamos suas informações pessoais com terceiros, exceto nas seguintes situações:</p>

<ul>
  <li>Com provedores de serviços que nos ajudam a operar nosso site</li>
  <li>Para cumprir obrigações legais</li>
  <li>Para proteger e defender nossos direitos e propriedade</li>
  <li>Com sua permissão ou sob sua direção</li>
</ul>

<h2>Segurança de Dados</h2>

<p>A segurança de seus dados é importante para nós, mas lembre-se de que nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro. Embora nos esforcemos para usar meios comercialmente aceitáveis para proteger suas informações pessoais, não podemos garantir sua segurança absoluta.</p>

<h2>Seus Direitos</h2>

<p>Se você reside na União Europeia, você tem certos direitos de proteção de dados. Nosso objetivo é tomar medidas razoáveis para permitir que você corrija, altere, exclua ou limite o uso de suas informações pessoais.</p>

<p>Se você deseja ser informado sobre quais informações pessoais mantemos sobre você e se deseja que elas sejam removidas de nossos sistemas, entre em contato conosco.</p>

<h2>Alterações nesta Política de Privacidade</h2>

<p>Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova Política de Privacidade nesta página.</p>

<p>Recomendamos que você revise esta Política de Privacidade periodicamente para quaisquer alterações. Alterações nesta Política de Privacidade são efetivas quando publicadas nesta página.</p>

<h2>Contato</h2>

<p>Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco:</p>

<ul>
  <li>Por e-mail: privacidade@risadanews.com.br</li>
  <li>Através da nossa <a href="/contato">página de contato</a></li>
</ul>
        `,
        meta_title: 'Política de Privacidade | Risada News Hub',
        meta_description: 'Conheça nossa política de privacidade e como tratamos seus dados pessoais no Risada News Hub.',
        featured_image: null,
        status: 'published',
        show_in_menu: true,
        menu_order: 3,
        author_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('pages', defaultPages, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pages', null, {});
  }
};
