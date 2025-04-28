'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Obter IDs das categorias existentes
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM categories WHERE active = true LIMIT 6;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Obter IDs dos usuários existentes
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE active = true LIMIT 2;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (categories.length === 0 || users.length === 0) {
      console.log('Não há categorias ou usuários para associar aos artigos. Execute os seeders anteriores primeiro.');
      return;
    }

    // Criar artigos de exemplo
    const demoArticles = [
      {
        title: 'Nova temporada de Stranger Things bate recordes de audiência',
        slug: 'nova-temporada-stranger-things-recordes-audiencia',
        summary: 'A série da Netflix continua a surpreender com números impressionantes de visualizações nas primeiras 24 horas.',
        content: `<p>A nova temporada de <strong>Stranger Things</strong> acaba de ser lançada e já está batendo todos os recordes anteriores de audiência na plataforma Netflix. De acordo com dados divulgados pela empresa, a série atingiu mais de 40 milhões de visualizações nas primeiras 24 horas após o lançamento.</p>
        
        <p>Os fãs aguardavam ansiosamente por esta temporada, que promete revelar mais segredos sobre o Mundo Invertido e trazer novos desafios para os personagens já conhecidos e amados pelo público.</p>
        
        <p>"Estamos extremamente felizes com a recepção do público", declarou um dos criadores da série. "Trabalhamos muito para entregar uma história à altura das expectativas dos fãs".</p>
        
        <p>A crítica especializada também tem elogiado os novos episódios, destacando a evolução dos personagens e os efeitos especiais ainda mais impressionantes.</p>`,
        category_id: categories[0].id,
        author_id: users[0].id,
        featured_image: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?q=80&w=1000',
        published: true,
        published_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Novo jogo de Harry Potter ultrapassa 10 milhões de cópias vendidas',
        slug: 'novo-jogo-harry-potter-10-milhoes-copias',
        summary: 'Hogwarts Legacy supera expectativas e se torna um dos jogos mais vendidos do ano em apenas uma semana.',
        content: `<p>O aguardado jogo <strong>Hogwarts Legacy</strong>, ambientado no universo de Harry Potter, acaba de ultrapassar a marca impressionante de 10 milhões de cópias vendidas em sua primeira semana de lançamento.</p>
        
        <p>O título, que permite aos jogadores viverem a experiência de ser um estudante de Hogwarts no século XIX, muito antes dos eventos dos livros e filmes, conquistou tanto fãs da saga quanto jogadores em geral.</p>
        
        <p>Com um vasto mundo aberto para explorar, incluindo a famosa Escola de Magia e Bruxaria de Hogwarts, a vila de Hogsmeade e a Floresta Proibida, o jogo oferece dezenas de horas de conteúdo e uma história original que se encaixa perfeitamente no universo criado por J.K. Rowling.</p>
        
        <p>"O sucesso de Hogwarts Legacy demonstra o poder duradouro da marca Harry Potter e o desejo dos fãs de se imergirem neste mundo mágico", comentou o diretor do estúdio responsável pelo desenvolvimento.</p>`,
        category_id: categories[1].id,
        author_id: users[0].id,
        featured_image: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?q=80&w=1000',
        published: true,
        published_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Festival de Música Risada Rock anuncia line-up com grandes nomes',
        slug: 'festival-musica-risada-rock-line-up',
        summary: 'Evento que acontecerá em julho promete reunir os maiores nomes do rock nacional e internacional.',
        content: `<p>O <strong>Festival Risada Rock</strong> acaba de anunciar sua programação completa para a edição deste ano, que acontecerá nos dias 15, 16 e 17 de julho no Parque da Cidade.</p>
        
        <p>Entre as atrações confirmadas estão bandas internacionais como Foo Fighters, Arctic Monkeys e Red Hot Chili Peppers, além de nomes consagrados do rock nacional como Sepultura, Pitty e Raimundos.</p>
        
        <p>"Estamos muito empolgados com o line-up deste ano. Conseguimos reunir artistas que raramente vêm ao Brasil e que são pedidos constantes dos fãs", afirmou o organizador do evento.</p>
        
        <p>Além dos shows principais, o festival contará com palcos alternativos para bandas independentes, praça de alimentação com opções gastronômicas diversas e área de camping para os participantes.</p>
        
        <p>Os ingressos já estão à venda pelo site oficial do evento e, segundo a organização, o primeiro lote está prestes a esgotar devido à alta procura após o anúncio das atrações.</p>`,
        category_id: categories[3].id,
        author_id: users[1].id,
        featured_image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1000',
        published: true,
        published_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Atriz revela bastidores de cena icônica em filme de super-heróis',
        slug: 'atriz-revela-bastidores-cena-iconica-filme-super-herois',
        summary: 'Em entrevista exclusiva, estrela compartilha detalhes sobre os desafios de gravar uma das sequências mais comentadas do ano.',
        content: `<p>Em entrevista exclusiva ao Risada News Hub, a atriz principal do mais recente blockbuster de super-heróis revelou detalhes fascinantes sobre os bastidores da gravação de uma das cenas mais icônicas do filme.</p>
        
        <p>"Aquela sequência de ação que todos estão comentando levou quase um mês para ser filmada", revelou a estrela. "Foram dias exaustivos de preparação física, ensaios coreografados e muitas tomadas até conseguirmos o resultado perfeito".</p>
        
        <p>Segundo a atriz, a cena envolveu mais de 50 profissionais entre dublês, operadores de câmera e especialistas em efeitos especiais. "O que parece ser apenas alguns minutos na tela final é resultado de um trabalho meticuloso de toda a equipe".</p>
        
        <p>Ela também comentou sobre o uso de tecnologias de ponta nas filmagens: "Utilizamos câmeras especiais que capturam movimentos em alta velocidade e depois desaceleramos na edição para criar aquele efeito visual impressionante que todo mundo está elogiando".</p>
        
        <p>O filme tem sido um sucesso de bilheteria e já arrecadou mais de 800 milhões de dólares mundialmente, com críticas positivas tanto do público quanto de especialistas em cinema.</p>`,
        category_id: categories[4].id,
        author_id: users[1].id,
        featured_image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000',
        published: true,
        published_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Dicas para manter uma alimentação saudável durante a rotina agitada',
        slug: 'dicas-alimentacao-saudavel-rotina-agitada',
        summary: 'Especialista em nutrição compartilha estratégias práticas para se alimentar bem mesmo com pouco tempo disponível.',
        content: `<p>Manter uma alimentação equilibrada em meio à correria do dia a dia pode parecer um desafio impossível para muitas pessoas. No entanto, com algumas estratégias simples, é possível fazer escolhas mais saudáveis mesmo com uma agenda lotada.</p>
        
        <p>De acordo com a nutricionista Ana Silva, o planejamento é fundamental. "Separar um tempo no fim de semana para preparar algumas refeições antecipadamente pode fazer toda a diferença durante a semana", explica. "Você pode cozinhar grãos, assar legumes e preparar proteínas que serão utilizadas em diferentes combinações ao longo dos dias".</p>
        
        <p>Outra dica importante é sempre ter lanches saudáveis à mão. "Frutas, castanhas, iogurte natural e barras de cereais sem açúcar são opções práticas para evitar que você recorra a alimentos ultraprocessados quando a fome apertar", sugere a especialista.</p>
        
        <p>A hidratação também não deve ser negligenciada. "Muitas vezes confundimos sede com fome. Manter uma garrafa de água sempre por perto ajuda a manter o corpo hidratado e pode prevenir aquela vontade de comer algo só por impulso", complementa.</p>
        
        <p>Por fim, a nutricionista ressalta a importância de não pular refeições, mesmo quando o tempo é curto. "É melhor fazer uma refeição simples, mas nutritiva, do que ficar muitas horas sem comer e depois compensar com grandes quantidades de comida, geralmente não tão saudáveis", finaliza.</p>`,
        category_id: categories[5].id,
        author_id: users[0].id,
        featured_image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1000',
        published: true,
        published_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('articles', demoArticles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('articles', null, {});
  }
};
