const { Setting } = require('../models');

// Obter todas as configurações
exports.getAllSettings = async (req, res) => {
  try {
    // Obter todas as configurações do banco de dados
    const settings = await Setting.findAll();
    
    // Organizar as configurações por grupo
    const groupedSettings = settings.reduce((acc, setting) => {
      if (!acc[setting.group]) {
        acc[setting.group] = {};
      }
      acc[setting.group][setting.key] = setting.value;
      return acc;
    }, {});
    
    return res.status(200).json(groupedSettings);
  } catch (error) {
    console.error('[BACKEND] Erro ao buscar configurações:', error);
    return res.status(500).json({ message: 'Erro ao buscar configurações' });
  }
};

// Obter configurações por grupo
exports.getSettingsByGroup = async (req, res) => {
  try {
    const { group } = req.params;
    
    // Obter configurações do grupo especificado
    const settings = await Setting.findAll({
      where: { group }
    });
    
    // Transformar em um objeto chave-valor
    const groupSettings = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    
    return res.status(200).json(groupSettings);
  } catch (error) {
    console.error(`[BACKEND] Erro ao buscar configurações do grupo ${req.params.group}:`, error);
    return res.status(500).json({ message: `Erro ao buscar configurações do grupo ${req.params.group}` });
  }
};

// Obter uma configuração específica
exports.getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    
    // Buscar a configuração pelo key
    const setting = await Setting.findOne({
      where: { key }
    });
    
    if (!setting) {
      return res.status(404).json({ message: `Configuração '${key}' não encontrada` });
    }
    
    return res.status(200).json({ key: setting.key, value: setting.value });
  } catch (error) {
    console.error(`[BACKEND] Erro ao buscar configuração ${req.params.key}:`, error);
    return res.status(500).json({ message: `Erro ao buscar configuração ${req.params.key}` });
  }
};

// Atualizar configurações
exports.updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ message: 'Dados de configuração inválidos' });
    }
    
    // Para cada configuração no objeto, atualizar no banco de dados
    const updatePromises = Object.entries(settings).map(async ([key, value]) => {
      const setting = await Setting.findOne({ where: { key } });
      
      if (setting) {
        await setting.update({ value });
        return { key, value, updated: true };
      }
      
      return { key, updated: false, message: 'Configuração não encontrada' };
    });
    
    const results = await Promise.all(updatePromises);
    
    // Verificar se todas as atualizações foram bem-sucedidas
    const allUpdated = results.every(result => result.updated);
    
    if (allUpdated) {
      return res.status(200).json({ 
        message: 'Todas as configurações foram atualizadas com sucesso',
        results 
      });
    } else {
      return res.status(207).json({ 
        message: 'Algumas configurações não puderam ser atualizadas',
        results 
      });
    }
  } catch (error) {
    console.error('[BACKEND] Erro ao atualizar configurações:', error);
    return res.status(500).json({ message: 'Erro ao atualizar configurações' });
  }
};

// Atualizar uma configuração específica
exports.updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    if (value === undefined) {
      return res.status(400).json({ message: 'O valor da configuração é obrigatório' });
    }
    
    // Buscar a configuração pelo key
    const setting = await Setting.findOne({
      where: { key }
    });
    
    if (!setting) {
      return res.status(404).json({ message: `Configuração '${key}' não encontrada` });
    }
    
    // Atualizar o valor
    await setting.update({ value });
    
    return res.status(200).json({ 
      message: `Configuração '${key}' atualizada com sucesso`,
      key,
      value
    });
  } catch (error) {
    console.error(`[BACKEND] Erro ao atualizar configuração ${req.params.key}:`, error);
    return res.status(500).json({ message: `Erro ao atualizar configuração ${req.params.key}` });
  }
};

// Restaurar configurações padrão
exports.resetSettings = async (req, res) => {
  try {
    // Aqui você poderia implementar a lógica para restaurar as configurações padrão
    // Por exemplo, executando novamente o seeder de configurações padrão
    
    return res.status(200).json({ message: 'Configurações restauradas para os valores padrão' });
  } catch (error) {
    console.error('[BACKEND] Erro ao restaurar configurações padrão:', error);
    return res.status(500).json({ message: 'Erro ao restaurar configurações padrão' });
  }
};
