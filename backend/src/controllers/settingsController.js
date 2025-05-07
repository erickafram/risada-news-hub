const { Setting } = require('../models');

exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll({
      where: {
        group: 'appearance'
      }
    });

    // Transformar o array de settings em um objeto
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    res.json(settingsObj);
  } catch (error) {
    console.error('Erro ao buscar configurações públicas:', error);
    res.status(500).json({ error: 'Erro ao buscar configurações públicas' });
  }
};

// Método para buscar todas as configurações
exports.getAllSettings = async (req, res) => {
  try {
    // Verificar se o usuário tem permissão (isso seria feito por um middleware)
    
    const settings = await Setting.findAll();
    
    // Agrupar as configurações por grupo
    const groupedSettings = {};
    settings.forEach(setting => {
      if (!groupedSettings[setting.group]) {
        groupedSettings[setting.group] = {};
      }
      groupedSettings[setting.group][setting.key] = setting.value;
    });
    
    res.json(groupedSettings);
  } catch (error) {
    console.error('Erro ao buscar todas as configurações:', error);
    res.status(500).json({ error: 'Erro ao buscar todas as configurações' });
  }
};

// Método para buscar configurações por grupo
exports.getSettingsByGroup = async (req, res) => {
  try {
    const { group } = req.params;
    
    const settings = await Setting.findAll({
      where: { group }
    });
    
    // Transformar o array de settings em um objeto
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    
    res.json(settingsObj);
  } catch (error) {
    console.error(`Erro ao buscar configurações do grupo ${req.params.group}:`, error);
    res.status(500).json({ error: `Erro ao buscar configurações do grupo ${req.params.group}` });
  }
};

// Método para atualizar configurações
exports.updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Configurações inválidas' });
    }
    
    console.log('Recebendo configurações para atualizar:', JSON.stringify(settings, null, 2));
    
    // Atualizar cada configuração no banco de dados
    const updatePromises = [];
    
    for (const group in settings) {
      for (const key in settings[group]) {
        const value = settings[group][key];
        
        if (key === null || key === undefined || group === null || group === undefined) {
          console.log('Ignorando entrada com chave ou grupo inválido:', { group, key, value });
          continue;
        }
        
        updatePromises.push(
          Setting.findOne({ where: { group, key } })
            .then(setting => {
              if (setting) {
                // Atualizar configuração existente
                console.log(`Atualizando configuração existente: ${group}.${key} = ${value}`);
                return setting.update({ value });
              } else {
                // Criar nova configuração se não existir
                console.log(`Criando nova configuração: ${group}.${key} = ${value}`);
                return Setting.create({ 
                  group, 
                  key, 
                  value,
                  description: `Configuração ${key} do grupo ${group}` 
                });
              }
            })
            .catch(err => {
              console.error(`Erro ao processar ${group}.${key}:`, err);
              throw err;
            })
        );
      }
    }
    
    await Promise.all(updatePromises);
    
    res.json({ message: 'Configurações atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ error: 'Erro ao atualizar configurações' });
  }
};
