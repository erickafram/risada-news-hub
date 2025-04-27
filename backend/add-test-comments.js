require('dotenv').config();
const { Comment, Article, User } = require('./src/models');

async function addTestComments() {
  try {
    console.log('Adicionando comentários de teste...');
    
    // Verificar se existem artigos e usuários
    const articles = await Article.findAll();
    if (articles.length === 0) {
      console.log('Nenhum artigo encontrado. Não é possível adicionar comentários.');
      return;
    }
    
    const users = await User.findAll();
    if (users.length === 0) {
      console.log('Nenhum usuário encontrado. Não é possível adicionar comentários.');
      return;
    }
    
    // Usar o primeiro artigo e usuário para os comentários de teste
    const articleId = articles[0].id;
    const userId = users[0].id;
    
    // Criar comentários com diferentes status
    const comments = [
      {
        content: 'Este é um comentário aprovado de teste',
        status: 'approved',
        article_id: articleId,
        user_id: userId
      },
      {
        content: 'Este é outro comentário aprovado de teste',
        status: 'approved',
        article_id: articleId,
        user_id: userId
      },
      {
        content: 'Este é um comentário pendente de teste',
        status: 'pending',
        article_id: articleId,
        user_id: userId
      },
      {
        content: 'Este é um comentário de spam de teste',
        status: 'spam',
        article_id: articleId,
        user_id: userId
      }
    ];
    
    // Adicionar os comentários ao banco de dados
    await Comment.bulkCreate(comments);
    
    console.log('Comentários de teste adicionados com sucesso!');
    
    // Contar comentários por status
    const totalComments = await Comment.count();
    const approvedComments = await Comment.count({ where: { status: 'approved' } });
    const pendingComments = await Comment.count({ where: { status: 'pending' } });
    const spamComments = await Comment.count({ where: { status: 'spam' } });
    
    console.log('Total de comentários:', totalComments);
    console.log('Comentários aprovados:', approvedComments);
    console.log('Comentários pendentes:', pendingComments);
    console.log('Comentários spam:', spamComments);
    
  } catch (error) {
    console.error('Erro ao adicionar comentários de teste:', error);
  } finally {
    process.exit();
  }
}

addTestComments();
