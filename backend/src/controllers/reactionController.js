const { User, Article, sequelize } = require('../models');
const { Op } = require('sequelize');

// Definir modelo user_reactions diretamente com Sequelize
const UserReaction = sequelize.define('user_reaction', {
  id: {
    type: sequelize.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  article_id: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'articles',
      key: 'id'
    }
  },
  reaction_type: {
    type: sequelize.Sequelize.ENUM('heart', 'thumbsUp', 'laugh', 'angry', 'sad'),
    allowNull: false
  }
}, {
  tableName: 'user_reactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Definir modelo de contagem de reações
const ArticleReactionCount = sequelize.define('article_reaction_count', {
  article_id: {
    type: sequelize.Sequelize.INTEGER,
    primaryKey: true,
    references: {
      model: 'articles',
      key: 'id'
    }
  },
  reaction_type: {
    type: sequelize.Sequelize.ENUM('heart', 'thumbsUp', 'laugh', 'angry', 'sad'),
    primaryKey: true
  },
  count: {
    type: sequelize.Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'article_reaction_counts',
  timestamps: false
});

// Adicionar ou atualizar uma reação
exports.addOrUpdateReaction = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { articleId } = req.params;
    const { reactionType } = req.body;
    const userId = req.user.id;
    
    console.log(`[LOG REAÇÃO] Usuário ${userId} está reagindo ao artigo ${articleId} com ${reactionType}`);
    
    if (!['heart', 'thumbsUp', 'laugh', 'angry', 'sad'].includes(reactionType)) {
      console.log(`[LOG REAÇÃO] Tipo de reação inválido: ${reactionType}`);
      await transaction.rollback();
      return res.status(400).json({ message: 'Tipo de reação inválido' });
    }
    
    // Verificar se o artigo existe
    const article = await Article.findByPk(articleId);
    if (!article) {
      console.log(`[LOG REAÇÃO] Artigo não encontrado: ${articleId}`);
      await transaction.rollback();
      return res.status(404).json({ message: 'Artigo não encontrado' });
    }
    
    // Verificar contagem atual antes de qualquer alteração
    const currentCounts = await ArticleReactionCount.findAll({
      where: { article_id: articleId }
    });
    console.log(`[LOG REAÇÃO] Contagens atuais antes da alteração:`, 
      currentCounts.map(c => `${c.reaction_type}: ${c.count}`));
    
    // Buscar reação existente do usuário para este artigo
    const existingReaction = await UserReaction.findOne({
      where: {
        user_id: userId,
        article_id: articleId
      },
      transaction
    });
    
    let oldReactionType = null;
    console.log(`[LOG REAÇÃO] Reação existente: ${existingReaction ? existingReaction.reaction_type : 'nenhuma'}`);
    
    if (existingReaction) {
      oldReactionType = existingReaction.reaction_type;
      
      // Se a reação for a mesma, remover a reação
      if (existingReaction.reaction_type === reactionType) {
        console.log(`[LOG REAÇÃO] Removendo reação existente do tipo ${reactionType}`);
        await existingReaction.destroy({ transaction });
        
        // Decrementar a contagem de reações
        await decrementReactionCount(articleId, reactionType, transaction);
        
        // Verificar contagem após a alteração
        const updatedCounts = await ArticleReactionCount.findAll({
          where: { article_id: articleId },
          transaction
        });
        console.log(`[LOG REAÇÃO] Contagens após remover reação:`, 
          updatedCounts.map(c => `${c.reaction_type}: ${c.count}`));
        
        await transaction.commit();
        return res.status(200).json({ 
          message: 'Reação removida com sucesso',
          removed: true,
          reactionType 
        });
      } else {
        // Se a reação for diferente, atualizar a reação
        console.log(`[LOG REAÇÃO] Atualizando reação de ${oldReactionType} para ${reactionType}`);
        await existingReaction.update({ 
          reaction_type: reactionType 
        }, { transaction });
        
        // Decrementar a contagem da reação antiga e incrementar a nova
        await decrementReactionCount(articleId, oldReactionType, transaction);
        await incrementReactionCount(articleId, reactionType, transaction);
      }
    } else {
      // Se não existir, criar uma nova reação
      console.log(`[LOG REAÇÃO] Criando nova reação do tipo ${reactionType}`);
      await UserReaction.create({
        user_id: userId,
        article_id: articleId,
        reaction_type: reactionType
      }, { transaction });
      
      // Incrementar a contagem de reações
      await incrementReactionCount(articleId, reactionType, transaction);
    }
    
    // Verificar contagem final após todas as alterações
    const finalCounts = await ArticleReactionCount.findAll({
      where: { article_id: articleId }
    });
    console.log(`[LOG REAÇÃO] Contagens finais após todas as alterações:`, 
      finalCounts.map(c => `${c.reaction_type}: ${c.count}`));
    
    // Aguardar a conclusão da transação
    await transaction.commit();
    
    // Aguardar um momento para garantir que as alterações foram persistidas
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return res.status(200).json({ 
      message: 'Reação registrada com sucesso',
      articleId,
      reactionType,
      userId
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao processar reação:', error);
    return res.status(500).json({ message: 'Erro ao processar reação' });
  }
};

// Obter reação do usuário para um artigo específico
exports.getUserReaction = async (req, res) => {
  try {
    const { articleId } = req.params;
    const userId = req.user.id;
    
    const reaction = await UserReaction.findOne({
      where: {
        user_id: userId,
        article_id: articleId
      }
    });
    
    if (!reaction) {
      return res.status(200).json({ hasReaction: false });
    }
    
    return res.status(200).json({
      hasReaction: true,
      reactionType: reaction.reaction_type
    });
  } catch (error) {
    console.error('Erro ao buscar reação do usuário:', error);
    return res.status(500).json({ message: 'Erro ao buscar reação' });
  }
};

// Obter contagem de reações para um artigo
exports.getArticleReactions = async (req, res) => {
  try {
    const { articleId } = req.params;
    console.log(`[LOG CONTAGEM] Buscando contagem de reações para o artigo ID: ${articleId}`);
    
    // Contar diretamente do banco de dados para obter valores precisos
    const directCounts = {
      heart: 0,
      thumbsUp: 0,
      laugh: 0,
      angry: 0,
      sad: 0
    };
    
    // Obter contagens diretamente da tabela de reações de usuários
    for (const type of ['heart', 'thumbsUp', 'laugh', 'angry', 'sad']) {
      const count = await UserReaction.count({
        where: {
          article_id: articleId,
          reaction_type: type
        }
      });
      directCounts[type] = count;
    }
    
    console.log('[LOG CONTAGEM] Contagem direta de reações de usuários:', directCounts);
    
    // Verificar se o cache está correto
    const reactionCounts = await ArticleReactionCount.findAll({
      where: { article_id: articleId }
    });
    
    console.log(`[LOG CONTAGEM] Registros de cache encontrados: ${reactionCounts.length}`);
    
    // Inicializar objeto de resposta com zeros
    const cachedReactions = {
      heart: 0,
      thumbsUp: 0,
      laugh: 0,
      angry: 0,
      sad: 0
    };
    
    // Preencher com contagens do cache
    reactionCounts.forEach(reaction => {
      cachedReactions[reaction.reaction_type] = reaction.count;
    });
    
    console.log('[LOG CONTAGEM] Contagem da tabela de cache:', cachedReactions);
    
    // Corrigir o cache se houver discrepâncias
    let discrepancyFound = false;
    for (const type of ['heart', 'thumbsUp', 'laugh', 'angry', 'sad']) {
      if (directCounts[type] !== cachedReactions[type]) {
        console.log(`[LOG CONTAGEM] Discrepância encontrada para ${type}: cache=${cachedReactions[type]}, real=${directCounts[type]}`);
        discrepancyFound = true;
        
        // Atualizar o cache para corrigir a discrepância
        await ArticleReactionCount.upsert({
          article_id: articleId,
          reaction_type: type,
          count: directCounts[type]
        });
      }
    }
    
    if (discrepancyFound) {
      console.log('[LOG CONTAGEM] Cache de contagem corrigido. Usando valores reais:', directCounts);
    }
    
    // Sempre retornar as contagens diretas, que são mais precisas
    console.log('[LOG CONTAGEM] Retornando contagens diretas:', directCounts);
    
    return res.status(200).json(directCounts);
  } catch (error) {
    console.error('Erro ao buscar contagem de reações:', error);
    return res.status(500).json({ message: 'Erro ao buscar contagem de reações' });
  }
};

// Obter reações de um usuário
exports.getUserReactions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userReactions = await UserReaction.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Article,
          as: 'article',
          attributes: ['id', 'title', 'slug', 'featured_image', 'published_at']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    return res.status(200).json(userReactions);
  } catch (error) {
    console.error('Erro ao buscar reações do usuário:', error);
    return res.status(500).json({ message: 'Erro ao buscar reações do usuário' });
  }
};

// Funções auxiliares para gerenciar contagens de reações
async function incrementReactionCount(articleId, reactionType, transaction) {
  console.log(`[LOG INCREMENT] Incrementando contagem para artigo ${articleId}, reação ${reactionType}`);
  
  // Verificar contagem atual antes do incremento
  const beforeCount = await ArticleReactionCount.findOne({
    where: {
      article_id: articleId,
      reaction_type: reactionType
    },
    transaction
  });
  
  console.log(`[LOG INCREMENT] Contagem antes do incremento: ${beforeCount ? beforeCount.count : 'não existe'}`);
  
  // Contar diretamente as reações do usuário para este tipo
  const realCount = await UserReaction.count({
    where: {
      article_id: articleId,
      reaction_type: reactionType
    },
    transaction
  });
  
  console.log(`[LOG INCREMENT] Contagem real baseada nas reações dos usuários: ${realCount}`);
  
  // Atualizar ou criar o registro com a contagem correta
  await ArticleReactionCount.upsert({
    article_id: articleId,
    reaction_type: reactionType,
    count: realCount
  }, { transaction });
  
  // Verificar se a atualização foi aplicada corretamente
  const afterCount = await ArticleReactionCount.findOne({
    where: {
      article_id: articleId,
      reaction_type: reactionType
    },
    transaction
  });
  
  console.log(`[LOG INCREMENT] Contagem após a atualização: ${afterCount.count}`);
  return afterCount;
}

async function decrementReactionCount(articleId, reactionType, transaction) {
  console.log(`[LOG DECREMENT] Decrementando contagem para artigo ${articleId}, reação ${reactionType}`);
  
  // Verificar contagem atual antes do decremento
  const beforeCount = await ArticleReactionCount.findOne({
    where: {
      article_id: articleId,
      reaction_type: reactionType
    },
    transaction
  });
  
  console.log(`[LOG DECREMENT] Contagem antes do decremento: ${beforeCount ? beforeCount.count : 'não existe'}`);
  
  // Contar diretamente as reações do usuário para este tipo
  const realCount = await UserReaction.count({
    where: {
      article_id: articleId,
      reaction_type: reactionType
    },
    transaction
  });
  
  console.log(`[LOG DECREMENT] Contagem real baseada nas reações dos usuários: ${realCount}`);
  
  // Atualizar ou criar o registro com a contagem correta
  await ArticleReactionCount.upsert({
    article_id: articleId,
    reaction_type: reactionType,
    count: realCount
  }, { transaction });
  
  // Verificar se a atualização foi aplicada corretamente
  const afterCount = await ArticleReactionCount.findOne({
    where: {
      article_id: articleId,
      reaction_type: reactionType
    },
    transaction
  });
  
  if (afterCount) {
    console.log(`[LOG DECREMENT] Contagem após a atualização: ${afterCount.count}`);
  } else {
    console.log('[LOG DECREMENT] Registro não encontrado após a atualização');
  }
  return afterCount;
}

// Configurar associações para incluir artigos nas consultas
UserReaction.belongsTo(Article, { foreignKey: 'article_id', as: 'article' });

module.exports.UserReaction = UserReaction;
module.exports.ArticleReactionCount = ArticleReactionCount;
